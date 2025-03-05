import React from 'react';
import { useParams } from 'react-router-dom';
import UserGenBloxCreator from '../components/UserGenBloxCreator';

export default function UserGenBlox() {
  const { type } = useParams();
  return <UserGenBloxCreator type={type} />;
} 