'use client';
import { User } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/app/components';

const AssigneeSelect = () => {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => axios.get<User[]>('/api/users').then(res => res.data),
    staleTime: 1000 * 60,
    retry: 3,
  });

  if (isLoading) return <Skeleton height={30} />;

  if (error) return null;

  return (
    <Select.Root>
      <Select.Trigger />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          {/* <Select.Item value="">Unassigned</Select.Item> */}
          {users?.map(user => (
            <Select.Item key={user.id} value={user.id}>
              {user.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default AssigneeSelect;
