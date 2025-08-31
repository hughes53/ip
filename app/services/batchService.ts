import type { HistoryRecord, BatchGenerateOptions, User, Address } from '../types';
import WFDService from './addressService';
import { IdentityService } from './identityService';

export class BatchService {
  private addressService: WFDService;
  private identityService: IdentityService;

  constructor() {
    this.addressService = new WFDService();
    this.identityService = new IdentityService();
  }

  /**
   * 批量生成身份记录
   */
  async generateBatch(options: BatchGenerateOptions): Promise<HistoryRecord[]> {
    const { count, countries, includeEmail, includeAddress } = options;
    const records: HistoryRecord[] = [];

    for (let i = 0; i < count; i++) {
      try {
        // 选择随机国家（如果指定了多个国家）
        const country = countries.length > 0 
          ? countries[Math.floor(Math.random() * countries.length)]
          : 'US';

        // 生成基础用户信息
        const baseUser = await this.generateUserForCountry(country);
        
        // 增强用户信息
        const enhancedUser = this.identityService.enhanceUser(baseUser);

        // 生成地址信息
        let address: Address = {};
        let ip = '127.0.0.1';

        if (includeAddress) {
          try {
            // 获取随机IP
            const ipResult = await this.addressService.getCurrentIP();
            ip = ipResult.ip;

            // 根据IP获取坐标
            const coordinates = await this.addressService.getIPCoordinates(ip);
            
            // 根据坐标生成地址
            const addressResult = await this.addressService.getRandomAddress(
              coordinates.latitude, 
              coordinates.longitude
            );
            address = addressResult;
          } catch (error) {
            console.warn(`Failed to generate address for record ${i + 1}:`, error);
            // 使用默认地址
            address = this.generateDefaultAddress(country);
          }
        }

        // 创建历史记录
        const record: HistoryRecord = {
          id: this.generateId(),
          user: enhancedUser,
          address,
          ip,
          timestamp: Date.now() + i, // 确保每个记录有不同的时间戳
          isStarred: false
        };

        records.push(record);

        // 添加延迟以避免API限制
        if (i < count - 1) {
          await this.delay(100); // 100ms延迟
        }

      } catch (error) {
        console.error(`Error generating record ${i + 1}:`, error);
        // 继续生成其他记录
      }
    }

    return records;
  }

  /**
   * 根据国家生成用户信息
   */
  private async generateUserForCountry(country: string): Promise<User> {
    // 这里可以根据不同国家生成不同的用户信息
    // 目前使用通用的生成逻辑
    try {
      const userResponse = await this.addressService.getRandomUser(country);
      return userResponse.results[0];
    } catch (error) {
      // 如果API失败，生成默认用户
      return this.generateDefaultUser(country);
    }
  }

  /**
   * 生成默认用户信息
   */
  private generateDefaultUser(country: string): User {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return {
      name: {
        first: firstName,
        last: lastName
      },
      phone: this.generatePhoneNumber(country),
      id: {
        name: this.getIdTypeForCountry(country),
        value: this.generateIdNumber(country)
      }
    };
  }

  /**
   * 生成默认地址
   */
  private generateDefaultAddress(country: string): Address {
    const addresses = {
      'US': {
        road: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postcode: '10001',
        country: 'United States',
        coordinates: { latitude: 40.7128, longitude: -74.0060 }
      },
      'UK': {
        road: '10 Downing Street',
        city: 'London',
        state: 'England',
        postcode: 'SW1A 2AA',
        country: 'United Kingdom',
        coordinates: { latitude: 51.5074, longitude: -0.1278 }
      },
      'CA': {
        road: '100 Queen Street',
        city: 'Toronto',
        state: 'ON',
        postcode: 'M5H 2N2',
        country: 'Canada',
        coordinates: { latitude: 43.6532, longitude: -79.3832 }
      }
    };

    return addresses[country as keyof typeof addresses] || addresses['US'];
  }

  /**
   * 根据国家生成电话号码
   */
  private generatePhoneNumber(country: string): string {
    const patterns = {
      'US': () => `+1-${this.randomDigits(3)}-${this.randomDigits(3)}-${this.randomDigits(4)}`,
      'UK': () => `+44-${this.randomDigits(4)}-${this.randomDigits(6)}`,
      'CA': () => `+1-${this.randomDigits(3)}-${this.randomDigits(3)}-${this.randomDigits(4)}`,
      'AU': () => `+61-${this.randomDigits(1)}-${this.randomDigits(4)}-${this.randomDigits(4)}`,
      'DE': () => `+49-${this.randomDigits(3)}-${this.randomDigits(7)}`,
      'FR': () => `+33-${this.randomDigits(1)}-${this.randomDigits(2)}-${this.randomDigits(2)}-${this.randomDigits(2)}-${this.randomDigits(2)}`
    };

    const generator = patterns[country as keyof typeof patterns] || patterns['US'];
    return generator();
  }

  /**
   * 根据国家获取ID类型
   */
  private getIdTypeForCountry(country: string): string {
    const idTypes = {
      'US': 'SSN',
      'UK': 'National Insurance Number',
      'CA': 'Social Insurance Number',
      'AU': 'Tax File Number',
      'DE': 'Personalausweisnummer',
      'FR': 'Numéro de Sécurité Sociale'
    };

    return idTypes[country as keyof typeof idTypes] || 'ID Number';
  }

  /**
   * 根据国家生成ID号码
   */
  private generateIdNumber(country: string): string {
    const patterns = {
      'US': () => `${this.randomDigits(3)}-${this.randomDigits(2)}-${this.randomDigits(4)}`,
      'UK': () => `${this.randomLetters(2)}${this.randomDigits(6)}${this.randomLetters(1)}`,
      'CA': () => `${this.randomDigits(3)}-${this.randomDigits(3)}-${this.randomDigits(3)}`,
      'AU': () => this.randomDigits(9),
      'DE': () => this.randomDigits(10),
      'FR': () => `${this.randomDigits(1)}${this.randomDigits(2)}${this.randomDigits(2)}${this.randomDigits(2)}${this.randomDigits(3)}${this.randomDigits(3)}${this.randomDigits(2)}`
    };

    const generator = patterns[country as keyof typeof patterns] || patterns['US'];
    return generator();
  }

  /**
   * 生成随机数字字符串
   */
  private randomDigits(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  /**
   * 生成随机字母字符串
   */
  private randomLetters(length: number): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取支持的国家列表
   */
  getSupportedCountries(): Array<{code: string, name: string}> {
    return [
      { code: 'US', name: 'United States' },
      { code: 'UK', name: 'United Kingdom' },
      { code: 'CA', name: 'Canada' },
      { code: 'AU', name: 'Australia' },
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'JP', name: 'Japan' },
      { code: 'KR', name: 'South Korea' },
      { code: 'CN', name: 'China' },
      { code: 'IN', name: 'India' }
    ];
  }

  /**
   * 验证批量生成选项
   */
  validateBatchOptions(options: BatchGenerateOptions): string[] {
    const errors: string[] = [];

    if (options.count < 1 || options.count > 100) {
      errors.push('Count must be between 1 and 100');
    }

    if (options.countries.length === 0) {
      errors.push('At least one country must be selected');
    }

    const supportedCountries = this.getSupportedCountries().map(c => c.code);
    const invalidCountries = options.countries.filter(c => !supportedCountries.includes(c));
    if (invalidCountries.length > 0) {
      errors.push(`Unsupported countries: ${invalidCountries.join(', ')}`);
    }

    return errors;
  }
}
