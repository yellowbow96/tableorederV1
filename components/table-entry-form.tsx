'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface TableEntryFormProps {
  onSubmit: (tableNumber: string, customerName: string) => void;
}

export function TableEntryForm({ onSubmit }: TableEntryFormProps) {
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [nameError, setNameError] = useState('');
  const [tableError, setTableError] = useState('');

  // Validate name input (only alphabetic characters and spaces)
  const validateName = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Please enter your name');
      return false;
    }
    
    if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
      setNameError('Name should contain only letters and spaces');
      return false;
    }
    
    setNameError('');
    return true;
  };

  // Validate table number input (only numbers between 1-100)
  const validateTableNumber = (table: string) => {
    const trimmedTable = table.trim();
    if (!trimmedTable) {
      setTableError('Please enter a table number');
      return false;
    }
    
    if (!/^\d+$/.test(trimmedTable)) {
      setTableError('Table number should contain only digits');
      return false;
    }
    
    const tableNum = parseInt(trimmedTable);
    if (tableNum <= 0 || tableNum > 100) {
      setTableError('Table number must be between 1 and 100');
      return false;
    }
    
    setTableError('');
    return true;
  };

  // Real-time validation as user types
  useEffect(() => {
    if (customerName) validateName(customerName);
  }, [customerName]);

  useEffect(() => {
    if (tableNumber) validateTableNumber(tableNumber);
  }, [tableNumber]);

  const handleSubmit = () => {
    const trimmedTableNumber = tableNumber.trim();
    const trimmedCustomerName = customerName.trim();

    const isNameValid = validateName(trimmedCustomerName);
    const isTableValid = validateTableNumber(trimmedTableNumber);

    if (!isNameValid || !isTableValid) {
      return;
    }

    onSubmit(trimmedTableNumber, trimmedCustomerName);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto flex items-center justify-center min-h-screen"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Our Restaurant</CardTitle>
          <CardDescription>Please enter your details to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Your Name</Label>
              <Input
                id="customerName"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={nameError ? "border-red-500" : ""}
              />
              {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input
                id="tableNumber"
                placeholder="Enter table number"
                value={tableNumber}
                onChange={(e) => {
                  // Only allow numeric input
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setTableNumber(value);
                  }
                }}
                className={tableError ? "border-red-500" : ""}
              />
              {tableError && <p className="text-sm text-red-500 mt-1">{tableError}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full" variant="default">
            Continue
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}