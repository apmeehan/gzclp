import React from 'react';
import { Redirect } from 'expo-router';
import { gzclp } from '../js';

export default function Index() {
  // Check if the user has completed setup
  const state = gzclp.getProgramState();
  const setupCompleted = state.setupComplete === true;

  // Return a redirect based on the user's setup status
  if (setupCompleted) {
    return <Redirect href="/(screens)/home" />;
  } else {
    return <Redirect href="/(screens)/welcome" />;
  }
} 