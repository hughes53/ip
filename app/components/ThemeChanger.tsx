import { IconButton } from "@radix-ui/themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeChangerProps {
  iconSize: number;
}

export function ThemeChanger({ iconSize }: ThemeChangerProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 确保只在客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  // 在水合完成前显示默认图标
  if (!mounted) {
    return (
      <IconButton
        size="4"
        variant="ghost"
        aria-label="切换主题"
      >
        <SunIcon width={iconSize} height={iconSize} />
      </IconButton>
    );
  }

  return (
    <IconButton
      size="4"
      variant="ghost"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="切换主题"
    >
      {theme === "light" ? (
        <MoonIcon width={iconSize} height={iconSize} />
      ) : (
        <SunIcon width={iconSize} height={iconSize} />
      )}
    </IconButton>
  );
}
