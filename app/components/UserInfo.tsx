"use client";

import { DataList } from "@radix-ui/themes";
import { User } from "../types";
import { InfoItem } from "./InfoItem";
import { Signal } from "@preact/signals-react";

interface UserInfoProps {
  userSignal: Signal<User | null>;
  loading: boolean;
  email: string;
}

interface UserField {
  id: string;
  label: string;
  getValue: (user: User, email: string) => string;
}

export function UserInfo({
  userSignal,
  loading,
  email,
}: Readonly<UserInfoProps>) {
  const userFields: UserField[] = [
    {
      id: "last",
      label: "姓",
      getValue: (user) => user.name.last,
    },
    {
      id: "first",
      label: "名",
      getValue: (user) => user.name.first,
    },
    {
      id: "phone",
      label: "电话",
      getValue: (user) => user.phone,
    },
    {
      id: "ssn",
      label: "SSN",
      getValue: (user) => user.id.value || "暂无",
    },
    {
      id: "email",
      label: "邮箱",
      getValue: (_, email) => email,
    },
    // 新增的身份信息字段
    {
      id: "birthday",
      label: "生日",
      getValue: (user) => user.birthday ? new Date(user.birthday).toLocaleDateString('zh-CN') : "暂无",
    },
    {
      id: "bloodType",
      label: "血型",
      getValue: (user) => user.bloodType ? `${user.bloodType}型` : "暂无",
    },
    {
      id: "occupation",
      label: "职业",
      getValue: (user) => user.occupation || "暂无",
    },
    {
      id: "education",
      label: "学历",
      getValue: (user) => user.education || "暂无",
    },
    {
      id: "creditCard",
      label: "信用卡",
      getValue: (user) => user.creditCard || "暂无",
    },
  ];

  return (
    <DataList.Root>
      {userFields.map((field) => (
        <InfoItem
          key={field.id}
          label={field.label}
          value={
            userSignal.value
              ? field.getValue(userSignal.value, email)
              : undefined
          }
          loading={loading}
        />
      ))}
    </DataList.Root>
  );
}
