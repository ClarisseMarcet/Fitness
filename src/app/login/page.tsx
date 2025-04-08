"use client";

import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import LoginForm from "../../components/auth/LoginForm";
import Link from 'next/link';

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
    
          </div>
          <LoginForm />
        </div>
      </div>
    </MainLayout>
  );
} 