import { useEffect, useState } from "react";
import useUnifiedLeads from "./useUnifiedLeads";
import type { UnifiedLead } from "@/types/lead";

interface DuplicateCheckResult {
  duplicate: UnifiedLead | null;
  isChecking: boolean;
}

const normalizeEmail = (e: string) => e.trim().toLowerCase();
const normalizePhone = (p: string) => p.replace(/\D/g, "");

export function useLeadDuplicateCheck(
  email: string,
  phone: string
): DuplicateCheckResult {
  const { leads, isLoading } = useUnifiedLeads();
  const [debouncedEmail, setDebouncedEmail] = useState(email);
  const [debouncedPhone, setDebouncedPhone] = useState(phone);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);
    const t = setTimeout(() => {
      setDebouncedEmail(email);
      setDebouncedPhone(phone);
      setIsDebouncing(false);
    }, 400);
    return () => clearTimeout(t);
  }, [email, phone]);

  const normEmail = normalizeEmail(debouncedEmail);
  const normPhone = normalizePhone(debouncedPhone);

  const emailValid = normEmail.length > 0 && normEmail.includes("@") && normEmail.includes(".");
  const phoneValid = normPhone.length >= 8;

  let duplicate: UnifiedLead | null = null;
  if (emailValid || phoneValid) {
    duplicate =
      leads.find((l) => {
        if (emailValid && l.email && normalizeEmail(l.email) === normEmail) return true;
        if (phoneValid && l.phone && normalizePhone(l.phone) === normPhone) return true;
        return false;
      }) ?? null;
  }

  return {
    duplicate,
    isChecking: isDebouncing || isLoading,
  };
}