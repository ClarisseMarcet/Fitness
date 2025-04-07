"use client";

import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { LoginForm } from '../../components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Connexion à votre compte
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' '}
              <Link 
                href="/register" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                créez un compte gratuit
              </Link>
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </MainLayout>
  );
} 