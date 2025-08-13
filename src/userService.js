import { supabase } from "./supabaseClient";

export const userService = {
  /**
   * Fetch user data from the users table by user ID
   */
  async getUserData(userId) {
    try {
      console.log("🔍 Fetching user data for ID:", userId);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Error fetching user data:", error);
        throw error;
      }

      console.log("✅ User data fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Failed to fetch user data:", error);
      throw error;
    }
  },

  /**
   * Check if user has access based on their plan
   */
  async checkUserAccess(userId) {
    try {
      const userData = await this.getUserData(userId);
      return {
        hasAccess: userData.plan !== "DISCOVER",
        plan: userData.plan,
        userData,
      };
    } catch (error) {
      console.error("❌ Error checking user access:", error);
      // Default to no access if we can't fetch user data
      return {
        hasAccess: false,
        plan: "DISCOVER",
        userData: null,
      };
    }
  },
};
