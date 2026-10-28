// app/(tabs)/history.tsx — History tab (redirects to history)
import { Redirect } from 'expo-router';
export default function HistoryTab() {
  return <Redirect href="/history" />;
}
