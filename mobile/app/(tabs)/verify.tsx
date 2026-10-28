// app/(tabs)/verify.tsx — Verify tab (redirects to verify)
import { Redirect } from 'expo-router';
export default function VerifyTab() {
  return <Redirect href="/verify" />;
}
