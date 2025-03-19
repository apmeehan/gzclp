import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fa375a', // Primary pink/red from original theme
        },
        headerTintColor: '#fff', // White text
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
} 