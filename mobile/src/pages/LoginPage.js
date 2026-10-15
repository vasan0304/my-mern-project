import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Input, Btn } from "../components/UI";
import { colors } from "../utils/theme";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please enter both email and password");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
    } catch (e) {
      setError(e.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {/* Logo Badge */}
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>TMS</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>TMS Portal</Text>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email Address"
              value={form.email}
              onChangeText={(email) => setForm((f) => ({ ...f, email }))}
              placeholder="e.g. admin@tms.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              value={form.password}
              onChangeText={(password) => setForm((f) => ({ ...f, password }))}
              placeholder="••••••••"
              secureTextEntry
            />

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Btn
              onPress={handleLogin}
              size="lg"
              disabled={loading}
              style={styles.submitBtn}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Btn>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoBadge: {
    width: 58,
    height: 58,
    backgroundColor: colors.accent,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  logoBadgeText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 20,
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 28,
  },
  form: {
    width: "100%",
  },
  errorBox: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "500",
  },
  submitBtn: {
    marginTop: 8,
    width: "100%",
  },
});

