import type { User } from '../types';

export class IdentityService {
  private occupations = [
    'Software Engineer', 'Teacher', 'Doctor', 'Nurse', 'Lawyer', 'Accountant',
    'Marketing Manager', 'Sales Representative', 'Graphic Designer', 'Writer',
    'Chef', 'Mechanic', 'Electrician', 'Plumber', 'Architect', 'Engineer',
    'Pharmacist', 'Dentist', 'Veterinarian', 'Police Officer', 'Firefighter',
    'Pilot', 'Flight Attendant', 'Real Estate Agent', 'Insurance Agent',
    'Bank Teller', 'Customer Service Rep', 'Data Analyst', 'Project Manager',
    'HR Manager', 'Operations Manager', 'Financial Advisor', 'Consultant',
    'Photographer', 'Journalist', 'Social Worker', 'Psychologist',
    'Physical Therapist', 'Massage Therapist', 'Personal Trainer',
    'Restaurant Manager', 'Retail Manager', 'Warehouse Worker', 'Truck Driver',
    'Construction Worker', 'Carpenter', 'Painter', 'Landscaper', 'Janitor',
    'Security Guard', 'Receptionist', 'Administrative Assistant'
  ];

  private educationLevels = [
    'High School Diploma',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctoral Degree',
    'Professional Certificate',
    'Trade School Certificate',
    'Some College',
    'Graduate Certificate'
  ];

  private bloodTypes: Array<'A' | 'B' | 'AB' | 'O'> = ['A', 'B', 'AB', 'O'];

  /**
   * 生成随机生日
   */
  generateBirthday(minAge: number = 18, maxAge: number = 80): string {
    const today = new Date();
    const birthYear = today.getFullYear() - Math.floor(Math.random() * (maxAge - minAge + 1)) - minAge;
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1; // 使用28避免月份天数问题
    
    return `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
  }

  /**
   * 生成随机血型
   */
  generateBloodType(): 'A' | 'B' | 'AB' | 'O' {
    return this.bloodTypes[Math.floor(Math.random() * this.bloodTypes.length)];
  }

  /**
   * 生成随机职业
   */
  generateOccupation(): string {
    return this.occupations[Math.floor(Math.random() * this.occupations.length)];
  }

  /**
   * 生成随机教育背景
   */
  generateEducation(): string {
    return this.educationLevels[Math.floor(Math.random() * this.educationLevels.length)];
  }

  /**
   * 生成虚拟信用卡号（符合Luhn算法）
   */
  generateCreditCard(): string {
    // 使用常见的信用卡前缀
    const prefixes = [
      '4', // Visa
      '51', '52', '53', '54', '55', // MasterCard
      '34', '37', // American Express
      '6011', // Discover
    ];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    let cardNumber = prefix;
    
    // 生成剩余数字（除了最后一位校验位）
    const targetLength = prefix.startsWith('34') || prefix.startsWith('37') ? 15 : 16;
    while (cardNumber.length < targetLength - 1) {
      cardNumber += Math.floor(Math.random() * 10).toString();
    }
    
    // 计算Luhn校验位
    const checkDigit = this.calculateLuhnCheckDigit(cardNumber);
    cardNumber += checkDigit;
    
    // 格式化为 XXXX-XXXX-XXXX-XXXX 或 XXXX-XXXXXX-XXXXX
    if (cardNumber.length === 15) {
      return cardNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1-$2-$3');
    } else {
      return cardNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
    }
  }

  /**
   * 计算Luhn算法校验位
   */
  private calculateLuhnCheckDigit(cardNumber: string): string {
    let sum = 0;
    let alternate = true;
    
    // 从右到左处理数字
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      
      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }
      
      sum += digit;
      alternate = !alternate;
    }
    
    return ((10 - (sum % 10)) % 10).toString();
  }

  /**
   * 为现有用户添加扩展信息
   */
  enhanceUser(user: User): User {
    return {
      ...user,
      birthday: this.generateBirthday(),
      bloodType: this.generateBloodType(),
      occupation: this.generateOccupation(),
      education: this.generateEducation(),
      creditCard: this.generateCreditCard(),
    };
  }

  /**
   * 批量生成用户信息
   */
  generateBatchUsers(count: number, baseUsers: User[]): User[] {
    const enhancedUsers: User[] = [];
    
    for (let i = 0; i < count; i++) {
      // 如果有基础用户数据，随机选择一个进行增强
      if (baseUsers.length > 0) {
        const baseUser = baseUsers[Math.floor(Math.random() * baseUsers.length)];
        enhancedUsers.push(this.enhanceUser(baseUser));
      } else {
        // 如果没有基础数据，创建一个基本的用户结构
        const basicUser: User = {
          name: { first: 'Generated', last: 'User' },
          phone: '+1-555-0000',
          id: { name: 'ID', value: 'GENERATED' }
        };
        enhancedUsers.push(this.enhanceUser(basicUser));
      }
    }
    
    return enhancedUsers;
  }

  /**
   * 验证信用卡号是否符合Luhn算法
   */
  validateCreditCard(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let alternate = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));
      
      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }
      
      sum += digit;
      alternate = !alternate;
    }
    
    return sum % 10 === 0;
  }

  /**
   * 获取年龄（从生日计算）
   */
  getAgeFromBirthday(birthday: string): number {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * 格式化生日显示
   */
  formatBirthday(birthday: string): string {
    const date = new Date(birthday);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
