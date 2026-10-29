// app/verify/evidence.tsx — Evidence & Source Verification Screen
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Claim, Evidence } from '../../types';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function EvidenceScreen() {
  const params = useLocalSearchParams<{ claim?: string; evidence?: string }>();
  
  let claim: Claim | null = null;
  let evidenceList: Evidence[] = [];

  try {
    if (params.claim) {
      claim = JSON.parse(params.claim);
      if (claim?.evidence) {
        evidenceList = claim.evidence;
      }
    } else if (params.evidence) {
      evidenceList = JSON.parse(params.evidence);
    }
  } catch {
    // Graceful fallback
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header / Claim info */}
        {claim && (
          <View style={styles.claimBox}>
            <Text style={styles.claimLabel}>CLAIM BEING VERIFIED</Text>
            <Text style={styles.claimText}>"{claim.text}"</Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            🔍 Retrieved Evidence Sources ({evidenceList.length})
          </Text>
          <Text style={styles.sectionDesc}>
            Real-world citations and web sources used by the verification agent.
          </Text>
        </View>

        {evidenceList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No evidence sources were retrieved for this claim.</Text>
          </View>
        ) : (
          evidenceList.map((ev, i) => (
            <View key={ev.id || i} style={styles.evidenceCard}>
              <View style={styles.badgeRow}>
                <View style={styles.sourceIndexBadge}>
                  <Text style={styles.sourceIndexText}>Source #{i + 1}</Text>
                </View>
                {ev.source.quality_score !== undefined && (
                  <View style={styles.qualityBadge}>
                    <Text style={styles.qualityScore}>{ev.source.quality_score}</Text>
                    <Text style={styles.qualityLabel}>/100 Trust</Text>
                  </View>
                )}
              </View>

              <Text style={styles.evidenceSnippet}>"{ev.snippet}"</Text>

              <View style={styles.sourceInfo}>
                <Text style={styles.sourceTitle} numberOfLines={2}>
                  {ev.source.title || ev.source.url}
                </Text>
                {ev.source.publisher && (
                  <Text style={styles.sourcePublisher}>{ev.source.publisher}</Text>
                )}
              </View>

              {ev.source.quality_reasons && ev.source.quality_reasons.length > 0 && (
                <View style={styles.reasonsRow}>
                  {ev.source.quality_reasons.map((r, ri) => (
                    <View key={ri} style={styles.reasonChip}>
                      <Text style={styles.reasonText}>{r}</Text>
                    </View>
                  ))}
                </View>
              )}

              {ev.source.url && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(ev.source.url)}
                  style={styles.openSourceBtn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.openSourceText}>Open Original Source →</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.base,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  claimBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.base,
  },
  claimLabel: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.xs,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  claimText: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  sectionHeader: {
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.lg,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  sectionDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
  },
  emptyBox: {
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
  evidenceCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sourceIndexBadge: {
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sourceIndexText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.xs,
    fontFamily: 'Inter_600SemiBold',
  },
  evidenceSnippet: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    lineHeight: 21,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
    backgroundColor: `${Colors.surfaceElevated}`,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  sourceInfo: {
    marginBottom: Spacing.sm,
  },
  sourceTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    fontFamily: 'Inter_600SemiBold',
  },
  sourcePublisher: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.xs,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: `${Colors.accentGreen}15`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qualityScore: {
    color: Colors.accentGreen,
    fontSize: Typography.fontSize.sm,
    fontFamily: 'Inter_700Bold',
  },
  qualityLabel: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.xs,
    marginLeft: 3,
  },
  reasonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.md,
  },
  reasonChip: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  reasonText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.xs,
  },
  openSourceBtn: {
    alignSelf: 'flex-start',
    backgroundColor: `${Colors.primary}15`,
    borderWidth: 1,
    borderColor: `${Colors.primary}35`,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  openSourceText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.xs,
    fontFamily: 'Inter_600SemiBold',
  },
});
