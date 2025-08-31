"use client";

import { useState } from "react";
import {
  Card,
  Flex,
  Text,
  Switch,
  Badge,
  Box,
  Separator,
  Heading,
  Button
} from "@radix-ui/themes";
import { LightningBoltIcon, ClockIcon, BarChartIcon } from "@radix-ui/react-icons";
import { PerformanceComparison } from "./PerformanceComparison";

interface MailServiceSelectorProps {
  useOptimized: boolean;
  onToggle: (useOptimized: boolean) => void;
  availableDomains?: string[];
}

export function MailServiceSelector({
  useOptimized,
  onToggle,
  availableDomains = []
}: MailServiceSelectorProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);

  return (
    <Card size="2" style={{ marginBottom: "16px" }}>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <Heading size="3">邮箱服务配置</Heading>
            {useOptimized && (
              <Badge color="green" size="1">
                <LightningBoltIcon width="12" height="12" />
                优化版
              </Badge>
            )}
            {!useOptimized && (
              <Badge color="blue" size="1">
                <ClockIcon width="12" height="12" />
                标准版
              </Badge>
            )}
          </Flex>
          <Switch
            checked={useOptimized}
            onCheckedChange={onToggle}
            size="2"
          />
        </Flex>

        <Separator size="4" />

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium" color={useOptimized ? "green" : "blue"}>
            {useOptimized ? "🚀 优化邮箱服务 (推荐)" : "🔄 标准邮箱服务"}
          </Text>
          
          <Text size="1" color="gray">
            {useOptimized 
              ? "使用固定域名池，提升创建速度和稳定性" 
              : "动态获取域名，可能较慢但域名更多样"
            }
          </Text>

          {useOptimized && availableDomains.length > 0 && (
            <Box>
              <Text size="1" weight="medium" style={{ marginBottom: "8px" }}>
                可用域名池 ({availableDomains.length}个):
              </Text>
              <Flex wrap="wrap" gap="1">
                {availableDomains.map((domain, index) => (
                  <Badge key={index} variant="soft" size="1">
                    {domain}
                  </Badge>
                ))}
              </Flex>
            </Box>
          )}
        </Flex>

        <Flex gap="2">
          <Box
            style={{
              cursor: "pointer",
              padding: "8px",
              borderRadius: "4px",
              backgroundColor: "var(--gray-2)",
              flex: 1
            }}
            onClick={() => setShowDetails(!showDetails)}
          >
            <Text size="1" color="gray">
              {showDetails ? "隐藏" : "显示"}技术详情 {showDetails ? "▲" : "▼"}
            </Text>
          </Box>

          <Button
            variant="soft"
            size="1"
            onClick={() => setShowPerformance(true)}
          >
            <BarChartIcon width="12" height="12" />
            性能对比
          </Button>
        </Flex>

        {showDetails && (
          <Box style={{ padding: "12px", backgroundColor: "var(--gray-1)", borderRadius: "6px" }}>
            <Flex direction="column" gap="2">
              <Text size="1" weight="medium">优化版特性:</Text>
              <Text size="1" color="gray">• 固定域名池: {availableDomains.join(", ")}</Text>
              <Text size="1" color="gray">• 跳过域名API调用，提升50%创建速度</Text>
              <Text size="1" color="gray">• 减少网络请求，提高稳定性</Text>
              <Text size="1" color="gray">• 本地随机用户名生成算法</Text>
              
              <Separator size="1" style={{ margin: "8px 0" }} />
              
              <Text size="1" weight="medium">标准版特性:</Text>
              <Text size="1" color="gray">• 动态获取最新可用域名</Text>
              <Text size="1" color="gray">• 使用官方 @cemalgnlts/mailjs 库</Text>
              <Text size="1" color="gray">• 域名池更新及时</Text>
              <Text size="1" color="gray">• 完全兼容原有功能</Text>
            </Flex>
          </Box>
        )}
      </Flex>

      {/* 性能对比弹窗 */}
      <PerformanceComparison
        isVisible={showPerformance}
        onClose={() => setShowPerformance(false)}
      />
    </Card>
  );
}
