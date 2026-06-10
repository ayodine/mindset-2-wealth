import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials missing. Form submissions will not be saved.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Submit a completed form response.
 * Prioritizes sending the email via Web3Forms and makes Supabase database logging non-blocking.
 * 
 * @param {Object} answers - The form answers keyed by question ID
 * @returns {{ success: boolean, error?: string }}
 */
export async function submitFormResponse(answers) {
  const payload = {
    country: answers.q1 || null,
    primary_financial_goal: answers.q2 || null,
    current_financial_situation: answers.q3 || null,
    wealth_mindset_challenge: answers.q4 || null,
    wealth_meaning: answers.q5 || null,
    wealth_goal_1_3_years: answers.q6 || null,
    monthly_save_invest: answers.q7 || null,
    willing_to_follow_5_sessions: answers.q8 || null,
    investment_ready_usd4675: answers.q9 || null,
    first_name: answers.q10?.firstName || null,
    last_name: answers.q10?.lastName || null,
    email: answers.q10?.email || null,
    phone: answers.q10?.phone || null,
  };

  try {
    // 1. Submit email via Web3Forms (Primary guaranteed delivery channel)
    const web3FormsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "b47500b3-ba0e-4a5c-aed4-4a92b9b89c4e";
    const emailResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: web3FormsKey,
        subject: `New Wealth Lead: ${payload.first_name || ''} ${payload.last_name || ''}`,
        from_name: "Wealth Roadmap Application",
        replyto: payload.email || undefined, /* Direct reply in client inbox */
        "First Name": payload.first_name,
        "Last Name": payload.last_name,
        "Email": payload.email,
        "Phone": payload.phone,
        "Country": payload.country,
        "Primary Financial Goal": payload.primary_financial_goal,
        "Current Financial Situation": payload.current_financial_situation,
        "Wealth Mindset Challenge": payload.wealth_mindset_challenge,
        "Meaning of Wealth": payload.wealth_meaning,
        "1-3 Year Wealth Goal": payload.wealth_goal_1_3_years,
        "Monthly Save/Invest Amount": payload.monthly_save_invest,
        "Willing to Follow 5 Sessions": payload.willing_to_follow_5_sessions,
        "Ready to Invest USD4,675": payload.investment_ready_usd4675
      })
    });

    const emailResult = await emailResponse.json();
    if (!emailResponse.ok || !emailResult.success) {
      throw new Error(emailResult.message || "Failed to send email submission");
    }

    // 2. Submit to Supabase database in the background (Optional, failures won't block users)
    if (supabase) {
      supabase.from('form_submissions').insert([payload]).then(({ error }) => {
        if (error) {
          console.warn('Optional Supabase insert failed (non-blocking):', error);
        } else {
          console.log('Saved to Supabase successfully');
        }
      });
    }

    return { success: true };
  } catch (err) {
    console.error('Error submitting form:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Submit a workshop inquiry response.
 * Prioritizes sending the email via Web3Forms and makes Supabase database logging non-blocking.
 * 
 * @param {Object} answers - The form answers keyed by question ID
 * @returns {{ success: boolean, error?: string }}
 */
export async function submitWorkshopResponse(answers) {
  const payload = {
    full_name: answers.w1?.fullName || null,
    organization_name: answers.w1?.organizationName || null,
    job_title: answers.w1?.jobTitle || null,
    email: answers.w2?.email || null,
    website_link: answers.w2?.websiteLink || null,
    location: answers.w6 || null,
    expected_attendees: answers.w7 || null,
    session_type: answers.w8 || null,
    topics: answers.w9 || [],
    format: answers.w10 || null,
    event_date_time: answers.w11 || null,
    has_budget: answers.w12 || null,
    audience_struggles: answers.w13 || null,
    success_outcome: answers.w14 || null,
    referral_source: answers.w15 || null,
  };

  try {
    // 1. Submit email via Web3Forms (Primary guaranteed delivery channel)
    const web3FormsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "b47500b3-ba0e-4a5c-aed4-4a92b9b89c4e";
    const emailResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: web3FormsKey,
        subject: `New Workshop Inquiry: ${payload.full_name || ''} - ${payload.organization_name || ''}`,
        from_name: "Workshop Inquiry Form",
        replyto: payload.email || undefined,
        "Full Name": payload.full_name,
        "Organization": payload.organization_name,
        "Job Title": payload.job_title,
        "Email": payload.email,
        "Website or Organization Link": payload.website_link,
        "Location": payload.location,
        "Expected Attendees": payload.expected_attendees,
        "Session Type": payload.session_type,
        "Topics": payload.topics ? payload.topics.join(', ') : '',
        "Preferred Format": payload.format,
        "Date & Time": payload.event_date_time,
        "Has Budget": payload.has_budget,
        "Audience Struggles": payload.audience_struggles,
        "Success Outcome": payload.success_outcome,
        "How They Heard": payload.referral_source
      })
    });

    const emailResult = await emailResponse.json();
    if (!emailResponse.ok || !emailResult.success) {
      throw new Error(emailResult.message || "Failed to send email submission");
    }

    // 2. Submit to Supabase database in the background (Optional, failures won't block users)
    if (supabase) {
      supabase.from('workshop_submissions').insert([payload]).then(({ error }) => {
        if (error) {
          console.warn('Optional Supabase insert failed (non-blocking):', error);
        } else {
          console.log('Saved to Supabase successfully');
        }
      });
    }

    return { success: true };
  } catch (err) {
    console.error('Error submitting workshop inquiry:', err);
    return { success: false, error: err.message };
  }
}


