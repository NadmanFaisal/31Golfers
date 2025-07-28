import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" 
        options={{
          headerShown: true,
        }}/>
      <Stack.Screen name="(signup)/signup" 
        options={{
          headerTitle: '',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
