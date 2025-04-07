"use client";

import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { RegisterForm } from '../../components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Créer un compte
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' '}
              <Link 
                href="/login" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                connectez-vous à votre compte existant
              </Link>
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </MainLayout>
  );
} 