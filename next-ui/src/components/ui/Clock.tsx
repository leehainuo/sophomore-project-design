"use client";

import React, { useState, useEffect } from 'react';

export default function Clock() {
  // 初始状态为 null，确保服务器端渲染时不会有时间差异
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // 客户端挂载后设置初始时间
    setTime(new Date());

    // 每秒更新时间
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId); // 清理定时器
  }, []);

  return (
    <div className="text-2xl font-bold text-center p-4">
      {time ? time.toLocaleTimeString() : '加载中...'}
    </div>
  );
} 