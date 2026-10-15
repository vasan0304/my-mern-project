import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import api from "../utils/api";
import { Spinner, PillChips } from "../components/UI";
import { colors } from "../utils/theme";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const loadStats = async () => {
    try {
      const data = await api("/complaints/dashboard");
      setStats(data);
    } catch (e) {
      console.error("Dashboard error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const cards = stats
    ? [
        { label: "Total Complaints", value: stats.total ?? 0, color: colors.accent, marker: "OVERVIEW", icon: "📋" },
        { label: "Pending", value: stats.pending ?? 0, color: colors.warning, marker: "PENDING", icon: "⏳" },
        { label: "Assigned", value: stats.assigned ?? 0, color: "#a855f7", marker: "ASSIGNED", icon: "👤" },
        { label: "In-Progress", value: stats.inProgress ?? 0, color: "#06b6d4", marker: "IN-PROGRESS", icon: "⚙️" },
        { label: "On Hold", value: stats.onHold ?? 0, color: colors.textDim, marker: "ON HOLD", icon: "⏸️" },
        { label: "Completed", value: stats.completed ?? 0, color: colors.success, marker: "RESOLVED", icon: "✅" },
      ]
    : [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      {/* Title & Subtitle */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>System Overview</Text>
          <Text style={styles.subtitle}>Real-time complaint status and key operational metrics</Text>
        </View>
      </View>

      {/* Jobie-style Category Pills */}
      <PillChips
        items={[
          { value: "all", label: "All Metrics" },
          { value: "active", label: "Active Queue" },
          { value: "resolved", label: "Completed" },
          { value: "technicians", label: "Staff Load" },
        ]}
        selected={selectedFilter}
        onSelect={setSelectedFilter}
      />

      {loading && !refreshing ? (
        <Spinner />
      ) : (
        <View style={styles.grid}>
          {cards.map((c) => (
            <View key={c.label} style={styles.card}>
              {/* Header: Marker Pill on left, Squircle emblem on right */}
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.markerPill,
                    {
                      backgroundColor: `${c.color}15`,
                      borderColor: `${c.color}35`,
                    },
                  ]}
                >
                  <View style={[styles.markerDot, { backgroundColor: c.color }]} />
                  <Text style={[styles.markerText, { color: c.color }]}>{c.marker}</Text>
                </View>

                <View style={[styles.squircle, { backgroundColor: `${c.color}18`, borderColor: `${c.color}35` }]}>
                  <Text style={[styles.squircleText, { color: c.color }]}>{c.label[0]}</Text>
                </View>
              </View>

              {/* Stat Value */}
              <Text style={[styles.cardValue, { color: c.color }]}>{c.value}</Text>
              <Text style={styles.cardLabel}>{c.label}</Text>

              {/* Progress indicator bar */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      backgroundColor: c.color,
                      width: stats?.total ? `${Math.min(100, Math.round((c.value / (stats.total || 1)) * 100))}%` : "15%",
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 24,
  },
  headerRow: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
    marginTop: 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 20,
    margin: 8,
    minWidth: 260,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 280,
    maxWidth: 440,
    minHeight: 180,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  markerPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  markerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  markerText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  squircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  squircleText: {
    fontSize: 15,
    fontWeight: "900",
  },
  cardValue: {
    fontSize: 36,
    fontWeight: "900",
    lineHeight: 40,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textDim,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.bg,
    borderRadius: 2,
    marginTop: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
