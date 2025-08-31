// 简单的邮箱生成测试
const FIXED_DOMAINS = [
  "139.run",
  "vod365.com", 
  "pda315.com",
  "eattea.uk",
  "10086hy.com",
  "kelianbao.com"
];

function generateRandomUsername(length = Math.floor(Math.random() * 4) + 5) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getRandomDomain() {
  return FIXED_DOMAINS[Math.floor(Math.random() * FIXED_DOMAINS.length)];
}

console.log("🧪 邮箱生成测试");
console.log("================");

for (let i = 1; i <= 5; i++) {
  const username = generateRandomUsername();
  const domain = getRandomDomain();
  const email = `${username}@${domain}`;
  console.log(`${i}. ${email}`);
}

console.log("\n✅ 测试完成！");
console.log("📊 固定域名池:", FIXED_DOMAINS.join(", "));
console.log("🚀 优化版邮箱生成无需网络请求获取域名，速度更快！");
