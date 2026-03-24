"use client";

import { createClient } from "@/lib/supabase/client";

type CreateMemberInput = {
  fullName: string;
  phone: string;
  notes?: string;
  paymentDate: string;
};

type UpdateMemberInput = {
  memberId: string;
  fullName: string;
  phone: string;
  notes?: string;
};

export async function createMemberWithSubscription({
  fullName,
  phone,
  notes,
  paymentDate,
}: CreateMemberInput) {
  const supabase = createClient();

  return supabase.rpc("create_member_with_subscription", {
    p_full_name: fullName,
    p_phone: phone,
    p_notes: notes?.trim() ? notes : null,
    p_payment_date: paymentDate,
  });
}

export async function renewMemberSubscription(
  memberId: string,
  paymentDate: string,
) {
  const supabase = createClient();

  return supabase.rpc("renew_membership", {
    p_member_id: memberId,
    p_payment_date: paymentDate,
  });
}

export async function updateMemberProfile({
  memberId,
  fullName,
  phone,
  notes,
}: UpdateMemberInput) {
  const supabase = createClient();
  const trimmedFullName = fullName.trim();
  const trimmedPhone = phone.trim();

  return supabase
    .from("members")
    .update({
      full_name: trimmedFullName,
      phone: trimmedPhone,
      notes: notes?.trim() ? notes : null,
    })
    .eq("id", memberId)
    .select("*")
    .single();
}

export async function deleteMember(memberId: string) {
  const supabase = createClient();
  return supabase.from("members").delete().eq("id", memberId);
}
