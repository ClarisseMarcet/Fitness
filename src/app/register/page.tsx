"use client";

import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { RegisterForm } from "../../components/auth/RegisterForm";
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <RegisterForm />
        </div>
      </div>
    </MainLayout>
  );
} 