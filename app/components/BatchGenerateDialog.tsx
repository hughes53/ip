"use client";

import { useState } from "react";
import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  Checkbox,
  Select,
  Box,
  Badge,
  Separator,
  Progress,
} from "@radix-ui/themes";
import { PlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import type { BatchGenerateOptions, HistoryRecord } from "../types";
import { BatchService } from "../services/batchService";

interface BatchGenerateDialogProps {
  onBatchGenerated: (records: HistoryRecord[]) => void;
}

export function BatchGenerateDialog({ onBatchGenerated }: BatchGenerateDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState<BatchGenerateOptions>({
    count: 5,
    countries: ['US'],
    includeEmail: true,
    includeAddress: true,
  });

  const batchService = new BatchService();
  const supportedCountries = batchService.getSupportedCountries();

  const handleCountChange = (value: string) => {
    const count = parseInt(value);
    if (!isNaN(count) && count >= 1 && count <= 100) {
      setOptions(prev => ({ ...prev, count }));
    }
  };

  const handleCountryToggle = (countryCode: string, checked: boolean) => {
    setOptions(prev => ({
      ...prev,
      countries: checked
        ? [...prev.countries, countryCode]
        : prev.countries.filter(c => c !== countryCode)
    }));
  };

  const handleGenerate = async () => {
    if (options.countries.length === 0) {
      alert('请至少选择一个国家');
      return;
    }

    const errors = batchService.validateBatchOptions(options);
    if (errors.length > 0) {
      alert(`配置错误：\n${errors.join('\n')}`);
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const records = await batchService.generateBatch(options);
      
      clearInterval(progressInterval);
      setProgress(100);

      // 短暂显示完成状态
      setTimeout(() => {
        onBatchGenerated(records);
        setOpen(false);
        setProgress(0);
      }, 500);

    } catch (error) {
      console.error('Batch generation failed:', error);
      alert('批量生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button size="2" variant="outline">
          <PlusIcon />
          <Text>批量生成</Text>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>批量生成身份信息</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          一次生成多个虚拟身份信息，支持不同国家和自定义选项
        </Dialog.Description>

        <Flex direction="column" gap="4">
          {/* 生成数量 */}
          <Box>
            <Text as="label" size="2" weight="bold" mb="2">
              生成数量 (1-100)
            </Text>
            <TextField.Root
              type="number"
              min="1"
              max="100"
              value={options.count.toString()}
              onChange={(e) => handleCountChange(e.target.value)}
              placeholder="输入生成数量"
            />
          </Box>

          {/* 国家选择 */}
          <Box>
            <Text as="label" size="2" weight="bold" mb="2">
              选择国家/地区
            </Text>
            <Box style={{ maxHeight: 200, overflowY: 'auto' }}>
              <Flex direction="column" gap="2">
                {supportedCountries.map(country => (
                  <Flex key={country.code} align="center" gap="2">
                    <Checkbox
                      checked={options.countries.includes(country.code)}
                      onCheckedChange={(checked) => 
                        handleCountryToggle(country.code, checked === true)
                      }
                    />
                    <Text size="2">{country.name}</Text>
                    <Badge size="1" variant="soft" color="gray">
                      {country.code}
                    </Badge>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </Box>

          {/* 生成选项 */}
          <Box>
            <Text as="label" size="2" weight="bold" mb="2">
              生成选项
            </Text>
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <Checkbox
                  checked={options.includeEmail}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeEmail: checked === true }))
                  }
                />
                <Text size="2">包含邮箱地址</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Checkbox
                  checked={options.includeAddress}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeAddress: checked === true }))
                  }
                />
                <Text size="2">包含地址信息</Text>
              </Flex>
            </Flex>
          </Box>

          {/* 选择的国家显示 */}
          {options.countries.length > 0 && (
            <Box>
              <Text size="2" color="gray" mb="2">
                已选择 {options.countries.length} 个国家：
              </Text>
              <Flex wrap="wrap" gap="1">
                {options.countries.map(code => {
                  const country = supportedCountries.find(c => c.code === code);
                  return (
                    <Badge key={code} size="1" variant="soft">
                      {country?.name || code}
                    </Badge>
                  );
                })}
              </Flex>
            </Box>
          )}

          {/* 进度条 */}
          {loading && (
            <Box>
              <Text size="2" mb="2">
                正在生成 {options.count} 个身份信息... ({Math.round(progress)}%)
              </Text>
              <Progress value={progress} />
            </Box>
          )}
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" disabled={loading}>
              取消
            </Button>
          </Dialog.Close>
          <Button 
            onClick={handleGenerate} 
            disabled={loading || options.countries.length === 0}
          >
            {loading ? '生成中...' : `生成 ${options.count} 个身份`}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
