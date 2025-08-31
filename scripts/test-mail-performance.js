/**
 * 邮箱服务性能测试脚本
 * 用于本地测试和验证优化效果
 */

const axios = require('axios');

// 固定域名池（与优化版相同）
const FIXED_DOMAINS = [
  "139.run",
  "vod365.com", 
  "pda315.com",
  "eattea.uk",
  "10086hy.com",
  "kelianbao.com"
];

// 生成随机用户名
function generateRandomUsername(length = Math.floor(Math.random() * 4) + 5) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 生成随机密码
function generateRandomPassword(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 从固定域名池中随机选择
function getRandomDomain() {
  return FIXED_DOMAINS[Math.floor(Math.random() * FIXED_DOMAINS.length)];
}

// 测试优化版邮箱创建
async function testOptimizedVersion() {
  console.log("🚀 测试优化版邮箱服务...");
  const startTime = Date.now();
  
  try {
    // 步骤1: 本地生成邮箱信息（无网络请求）
    const localStart = Date.now();
    const username = generateRandomUsername();
    const domain = getRandomDomain();
    const email = `${username}@${domain}`;
    const password = generateRandomPassword();
    const localTime = Date.now() - localStart;
    
    console.log(`  📧 生成邮箱: ${email}`);
    console.log(`  ⚡ 本地生成耗时: ${localTime}ms`);
    
    // 步骤2: 创建账户（网络请求1）
    const createStart = Date.now();
    const createResponse = await axios.post('https://api.mail.tm/accounts', {
      address: email,
      password: password
    });
    const createTime = Date.now() - createStart;
    
    if (createResponse.status === 201) {
      console.log(`  ✅ 账户创建成功，耗时: ${createTime}ms`);
      
      // 步骤3: 登录获取token（网络请求2）
      const loginStart = Date.now();
      const loginResponse = await axios.post('https://api.mail.tm/token', {
        address: email,
        password: password
      });
      const loginTime = Date.now() - loginStart;
      
      if (loginResponse.status === 200) {
        console.log(`  🔑 登录成功，耗时: ${loginTime}ms`);
        
        const totalTime = Date.now() - startTime;
        return {
          success: true,
          email: email,
          domain: domain,
          localTime,
          createTime,
          loginTime,
          totalTime,
          networkRequests: 2
        };
      }
    }
  } catch (error) {
    console.error(`  ❌ 优化版测试失败:`, error.response?.data?.message || error.message);
    return {
      success: false,
      totalTime: Date.now() - startTime,
      error: error.message
    };
  }
}

// 测试标准版邮箱创建（模拟）
async function testStandardVersion() {
  console.log("🔄 测试标准版邮箱服务...");
  const startTime = Date.now();
  
  try {
    // 步骤1: 获取域名列表（网络请求1）
    const domainStart = Date.now();
    const domainResponse = await axios.get('https://api.mail.tm/domains');
    const domainTime = Date.now() - domainStart;
    
    if (domainResponse.status === 200 && domainResponse.data['hydra:member'].length > 0) {
      const availableDomains = domainResponse.data['hydra:member'];
      const selectedDomain = availableDomains[Math.floor(Math.random() * availableDomains.length)];
      console.log(`  🌐 获取域名成功，耗时: ${domainTime}ms`);
      console.log(`  📋 可用域名数量: ${availableDomains.length}`);
      
      // 步骤2: 生成邮箱信息
      const username = generateRandomUsername();
      const email = `${username}@${selectedDomain.domain}`;
      const password = generateRandomPassword();
      
      console.log(`  📧 生成邮箱: ${email}`);
      
      // 步骤3: 创建账户（网络请求2）
      const createStart = Date.now();
      const createResponse = await axios.post('https://api.mail.tm/accounts', {
        address: email,
        password: password
      });
      const createTime = Date.now() - createStart;
      
      if (createResponse.status === 201) {
        console.log(`  ✅ 账户创建成功，耗时: ${createTime}ms`);
        
        // 步骤4: 登录获取token（网络请求3）
        const loginStart = Date.now();
        const loginResponse = await axios.post('https://api.mail.tm/token', {
          address: email,
          password: password
        });
        const loginTime = Date.now() - loginStart;
        
        if (loginResponse.status === 200) {
          console.log(`  🔑 登录成功，耗时: ${loginTime}ms`);
          
          const totalTime = Date.now() - startTime;
          return {
            success: true,
            email: email,
            domain: selectedDomain.domain,
            domainTime,
            createTime,
            loginTime,
            totalTime,
            networkRequests: 3
          };
        }
      }
    }
  } catch (error) {
    console.error(`  ❌ 标准版测试失败:`, error.response?.data?.message || error.message);
    return {
      success: false,
      totalTime: Date.now() - startTime,
      error: error.message
    };
  }
}

// 运行性能对比测试
async function runPerformanceTest() {
  console.log("📊 开始邮箱服务性能对比测试\n");
  
  // 测试优化版
  const optimizedResult = await testOptimizedVersion();
  console.log("");
  
  // 等待一秒避免API限制
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 测试标准版
  const standardResult = await testStandardVersion();
  console.log("");
  
  // 输出对比结果
  console.log("📈 性能对比结果:");
  console.log("=" * 50);
  
  if (optimizedResult.success && standardResult.success) {
    const improvement = Math.round(((standardResult.totalTime - optimizedResult.totalTime) / standardResult.totalTime) * 100);
    
    console.log(`🚀 优化版总耗时: ${optimizedResult.totalTime}ms`);
    console.log(`🔄 标准版总耗时: ${standardResult.totalTime}ms`);
    console.log(`📊 性能提升: ${improvement}%`);
    console.log("");
    
    console.log("详细对比:");
    console.log(`  域名获取: 优化版 0ms vs 标准版 ${standardResult.domainTime}ms`);
    console.log(`  账户创建: 优化版 ${optimizedResult.createTime}ms vs 标准版 ${standardResult.createTime}ms`);
    console.log(`  登录验证: 优化版 ${optimizedResult.loginTime}ms vs 标准版 ${standardResult.loginTime}ms`);
    console.log(`  网络请求: 优化版 ${optimizedResult.networkRequests}次 vs 标准版 ${standardResult.networkRequests}次`);
    console.log("");
    
    console.log("生成的邮箱:");
    console.log(`  优化版: ${optimizedResult.email} (域名: ${optimizedResult.domain})`);
    console.log(`  标准版: ${standardResult.email} (域名: ${standardResult.domain})`);
  } else {
    console.log("❌ 测试过程中出现错误");
    if (!optimizedResult.success) {
      console.log(`  优化版错误: ${optimizedResult.error}`);
    }
    if (!standardResult.success) {
      console.log(`  标准版错误: ${standardResult.error}`);
    }
  }
  
  console.log("\n🎯 测试完成！");
}

// 执行测试
if (require.main === module) {
  runPerformanceTest().catch(console.error);
}

module.exports = {
  testOptimizedVersion,
  testStandardVersion,
  runPerformanceTest
};
