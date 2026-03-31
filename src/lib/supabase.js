import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dfbwmzrqeiemmwoqobyc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmYndtenJxZWllbW13b3FvYnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNTgzMTUsImV4cCI6MjA4NzYzNDMxNX0.AuhiuKqBQ7S2SiAIiikPcfRPzStzl64MdLuopmhwIEI";

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function insertTransaction(payload) {
	try {
		const { data, error } = await supabase.from('transactions').insert([payload]).select();
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

// ---- Server sync helpers ------------------------------------------------

export async function fetchTransactionsForEmail(email) {
	try {
		const { data, error } = await supabase
			.from('transactions')
			.select('*')
			.eq('user_email', email)
			.order('date', { ascending: false });
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function upsertUserProfile(profile) {
	// expects { email, fullName, recoveryPhrase, savingsBalance }
	try {
		const { data, error } = await supabase
			.from('profiles')
			.upsert(profile);
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function fetchUserProfile(email) {
	try {
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('email', email)
			.single();
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function fetchBankCards(email) {
	try {
		const { data, error } = await supabase
			.from('bank_cards')
			.select('*')
			.eq('user_email', email);
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function insertBankCard(card, email) {
	try {
		const payload = { ...card, user_email: email };
		const { data, error } = await supabase.from('bank_cards').insert([payload]).select();
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function fetchBankAccounts(email) {
	try {
		const { data, error } = await supabase
			.from('bank_accounts')
			.select('*')
			.eq('user_email', email);
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function insertBankAccount(account, email) {
	try {
		const payload = { ...account, user_email: email };
		const { data, error } = await supabase.from('bank_accounts').insert([payload]).select();
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function saveSavings(email, savings) {
	try {
		const payload = { email, balance: savings };
		const { data, error } = await supabase.from('savings').upsert(payload);
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function fetchSavings(email) {
	try {
		const { data, error } = await supabase
			.from('savings')
			.select('*')
			.eq('email', email)
			.single();
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

// delete helpers for full round‑trip
export async function deleteBankCard(card, email) {
	// card can be object containing id or cardNumber
	try {
		let query = supabase.from('bank_cards').delete();
		if (card.id) {
			query = query.eq('id', card.id);
		} else if (card.cardNumber) {
			query = query
				.eq('card_number', card.cardNumber)
				.eq('user_email', email);
		} else {
			// nothing to delete
			return { data: null, error: null };
		}
		const { data, error } = await query;
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function deleteBankAccount(accountId, email) {
	try {
		const { data, error } = await supabase
			.from('bank_accounts')
			.delete()
			.eq('id', accountId)
			.eq('user_email', email);
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function deleteUserData(email, userId) {
	const results = {};
	try {
		if (email) {
			results.bankCards = await supabase.from('bank_cards').delete().eq('user_email', email);
			results.bankAccounts = await supabase.from('bank_accounts').delete().eq('user_email', email);
			results.savings = await supabase.from('savings').delete().eq('email', email);
			results.transactions = await supabase.from('transactions').delete().eq('user_email', email);
			results.profiles = await supabase.from('profiles').delete().eq('email', email);
		}
		if (userId) {
			results.auth = await supabase.auth.admin.deleteUser(userId);
		}
		return { data: results, error: null };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function fetchProfileByRecoveryPhrase(phrase) {
	try {
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('recoveryPhrase', phrase);
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

// ---- Goals helpers ------------------------------------------------

export async function fetchGoals(userId) {
	// userId is the user's ID from Supabase auth
	try {
		const { data, error } = await supabase
			.from('goals')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false });
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function insertGoal(goal, userId) {
	// goal should have: goal_name, target_amount, current_amount
	try {
		const payload = { ...goal, user_id: userId, created_at: new Date().toISOString() };
		const { data, error } = await supabase.from('goals').insert([payload]).select();
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function updateGoal(goal, userId) {
	// goal should have: id, and fields to update (goal_name, target_amount, current_amount, etc)
	try {
		const { data, error } = await supabase
			.from('goals')
			.update(goal)
			.eq('id', goal.id)
			.eq('user_id', userId)
			.select();
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}

export async function deleteGoal(goalId, userId) {
	try {
		const { data, error } = await supabase
			.from('goals')
			.delete()
			.eq('id', goalId)
			.eq('user_id', userId);
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
}