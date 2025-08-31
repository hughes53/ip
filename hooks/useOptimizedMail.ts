import { useState, useEffect } from "react";
import { optimizedMailService } from "@/services/mailService";
import type { TempMailMessage } from "@/app/types";

interface UseOptimizedMailReturn {
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

export default function useOptimizedMail(): UseOptimizedMailReturn {
  const [tempEmail, setTempEmail] = useState<string>("");
  const [emailLoading, setEmailLoading] = useState(true);
  const [messages, setMessages] = useState<TempMailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<TempMailMessage | null>(null);
  const [toastMessage, setToastMessage] = useState<TempMailMessage | null>(null);
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);

  useEffect(() => {
    const createEmail = async () => {
      setEmailLoading(true);
      try {
        // 获取可用域名
        setAvailableDomains(optimizedMailService.getAvailableDomains());
        
        // 创建邮箱账户
        const result = await optimizedMailService.createOneAccount();
        
        if (result.status) {
          setTempEmail(result.data.username);
          
          // 登录账户
          const loginResult = await optimizedMailService.login(
            result.data.username,
            result.data.password
          );
          
          if (loginResult.status) {
            console.log("🎉 邮箱创建并登录成功");
            
            // 启动邮件事件监听
            optimizedMailService.on("arrive", (message: TempMailMessage) => {
              setMessages(prev => [message, ...prev]);
              setToastMessage(message);
            });

            optimizedMailService.on("open", () => {
              console.log("🔗 邮件事件监听已启动");
            });

            // 修复类型错误：使用 unknown 类型
            optimizedMailService.on("error", (error: unknown) => {
              console.error("❌ 邮件事件监听错误:", error);
            });
            
          } else {
            console.error("❌ 邮箱登录失败:", loginResult.message);
          }
        } else {
          console.error("❌ 邮箱创建失败:", result.message);
        }
      } catch (error) {
        console.error("❌ 邮箱服务初始化失败:", error);
      } finally {
        setEmailLoading(false);
      }
    };

    if (!tempEmail) {
      createEmail();
    }

    // 清理函数
    return () => {
      optimizedMailService.destroy();
    };
  }, [tempEmail]);

  const handleMessageClick = async (msg: TempMailMessage) => {
    try {
      const result = await optimizedMailService.getMessage(msg.id);
      if (result.status) {
        setSelectedMessage(result.data);
      }
    } catch (error) {
      console.error("获取邮件详情失败:", error);
    }
  };

  const refreshMessages = async () => {
    try {
      const result = await optimizedMailService.getMessages();
      if (result.status) {
        setMessages(result.data.messages);
      }
    } catch (error) {
      console.error("刷新邮件列表失败:", error);
    }
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
