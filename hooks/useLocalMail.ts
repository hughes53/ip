import { useState, useEffect } from "react";
import { localMailService } from "@/services/localMailService";
import type { TempMailMessage } from "@/app/types";

interface UseLocalMailReturn {
  tempEmail: string;
  emailLoading: boolean;
  messages: TempMailMessage[];
  selectedMessage: TempMailMessage | null;
  toastMessage: TempMailMessage | null;
  setSelectedMessage: (message: TempMailMessage | null) => void;
  setToastMessage: (message: TempMailMessage | null) => void;
  handleMessageClick: (msg: TempMailMessage) => Promise<void>;
  availableDomains: string[];
  refreshMessages: () => Promise<void>;
}

export default function useLocalMail(): UseLocalMailReturn {
  const [tempEmail, setTempEmail] = useState<string>("");
  const [emailLoading, setEmailLoading] = useState(true);
  const [messages, setMessages] = useState<TempMailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<TempMailMessage | null>(null);
  const [toastMessage, setToastMessage] = useState<TempMailMessage | null>(null);
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // 确保客户端水合后再生成邮箱
  useEffect(() => {
    setIsClient(true);
    setAvailableDomains(localMailService.getAvailableDomains());
  }, []);

  useEffect(() => {
    const generateEmail = () => {
      setEmailLoading(true);
      try {
        // 生成邮箱地址
        const email = localMailService.generateEmail();
        setTempEmail(email);
        setEmailLoading(false);
      } catch (error) {
        setEmailLoading(false);
      }
    };

    if (!tempEmail && isClient) {
      generateEmail();
    }

    // 清理函数
    return () => {
      localMailService.destroy();
    };
  }, [tempEmail, isClient]);

  const handleMessageClick = async (msg: TempMailMessage) => {
    // 本地服务暂不支持邮件点击
  };

  const refreshMessages = async () => {
    // 本地服务暂不支持邮件刷新
  };

  return {
    tempEmail,
    emailLoading,
    messages,
    selectedMessage,
    toastMessage,
    setSelectedMessage,
    setToastMessage,
    handleMessageClick,
    availableDomains,
    refreshMessages,
  };
}
