/**
 * Real Supabase Database Status Verification Script.
 *
 * This script runs a real database verification against the actual Supabase project
 * using the real supabase-js client library:
 *
 * 1. Creates a real anonymous user session using Supabase Auth
 * 2. Inserts a real row into public.resumes table
 * 3. Inserts a real row into public.job_descriptions table
 * 4. Inserts a real row into public.optimizations table (defaulting to status = 'draft')
 * 5. Updates the optimizations row status to 'previewed'
 * 6. Updates the optimizations row status to 'downloaded'
 * 7. Queries the row back to confirm that it has been successfully updated to 'downloaded'.
 *
 * Run with: node scripts/verify_db_status.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Load environment variables from .env.local
const envRaw = readFileSync(path.join(ROOT, '.env.local'), 'utf8');
const SUPABASE_URL = envRaw.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const SUPABASE_ANON_KEY = envRaw.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Failed to load Supabase credentials from .env.local');
  process.exit(1);
}

console.log('=== Supabase DB Status Verification ===');
console.log('Supabase URL:', SUPABASE_URL);

async function main() {
  // 1. Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 2. Sign in anonymously (creates a real user session on the server)
  console.log('\n1. Signing in anonymously...');
  const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
  if (authError) {
    console.error('Auth failed:', authError.message);
    process.exit(1);
  }
  const userId = authData.user?.id;
  console.log(`   ✓ Authenticated as: ${userId} (is_anonymous: ${authData.user?.is_anonymous})`);

  const mockSessionId = '00000000-0000-0000-0000-000000000000';

  // 3. Insert real resume row with exact columns
  console.log('\n2. Inserting mock resume record...');
  const { data: resumeData, error: resumeError } = await supabase
    .from('resumes')
    .insert({
      user_id: userId,
      session_id: mockSessionId,
      raw_source_text: 'Alex Rivera\nSenior Full Stack Engineer\nTypeScript, React, Node.js',
      contact: { name: 'Alex Rivera', email: 'alex@example.com', phone: '555-111-2222', location: 'San Francisco, CA', links: [] },
      summary: 'Senior Full Stack Engineer with 6 years experience in TypeScript and React.',
      experience: [{ title: 'Senior Engineer', company: 'TechCorp', bullets: ['Led React migration'] }],
      education: [{ institution: 'UC Berkeley', degree: 'B.S.', field: 'Computer Science' }],
      skills: [{ category: 'Languages', list: ['TypeScript', 'React'] }]
    })
    .select()
    .single();

  if (resumeError) {
    console.error('   ✗ Failed to insert resume:', resumeError.message);
    process.exit(1);
  }
  const resumeId = resumeData.id;
  console.log('   ✓ Resume inserted with ID:', resumeId);

  // 4. Insert real job description row
  console.log('\n3. Inserting mock job description record...');
  const { data: jdData, error: jdError } = await supabase
    .from('job_descriptions')
    .insert({
      user_id: userId,
      raw_text: 'We are looking for a TypeScript React software engineer.',
      parsed_fields: { title: 'Software Engineer', skills: ['TypeScript', 'React'] }
    })
    .select()
    .single();

  if (jdError) {
    console.error('   ✗ Failed to insert job description:', jdError.message);
    process.exit(1);
  }
  const jdId = jdData.id;
  console.log('   ✓ Job description inserted with ID:', jdId);

  // 5. Insert real optimizations row (simulating optimization run)
  console.log('\n4. Inserting optimization record (status = "draft")...');
  const { data: optData, error: optError } = await supabase
    .from('optimizations')
    .insert({
      user_id: userId,
      session_id: mockSessionId,
      resume_id: resumeId,
      job_description_id: jdId,
      tailored_resume: {
        summary: 'Senior Software Engineer with experience in React and Node.',
        skills: ['TypeScript', 'React', 'Node.js']
      },
      score_parseability: 90,
      score_keyword_match: 85,
      score_knockout: 100,
      gaps_identified: ['No AWS certification mentioned'],
      matched_keywords: ['TypeScript', 'React'],
      status: 'draft'
    })
    .select()
    .single();

  if (optError) {
    console.error('   ✗ Failed to insert optimization:', optError.message);
    process.exit(1);
  }
  const optId = optData.id;
  console.log('   ✓ Optimization inserted with ID:', optId, 'and status:', optData.status);

  // 6. Update status to 'previewed' (simulating ResultsPage mount)
  console.log('\n5. Updating optimization status to "previewed"...');
  const { data: previewData, error: previewError } = await supabase
    .from('optimizations')
    .update({ status: 'previewed' })
    .eq('id', optId)
    .select()
    .single();

  if (previewError) {
    console.error('   ✗ Failed to update to "previewed":', previewError.message);
    process.exit(1);
  }
  console.log('   ✓ Optimization status updated to:', previewData.status);

  // 7. Update status to 'downloaded' (simulating download click)
  console.log('\n6. Updating optimization status to "downloaded"...');
  const { data: downloadData, error: downloadError } = await supabase
    .from('optimizations')
    .update({ status: 'downloaded' })
    .eq('id', optId)
    .select()
    .single();

  if (downloadError) {
    console.error('   ✗ Failed to update to "downloaded":', downloadError.message);
    process.exit(1);
  }
  console.log('   ✓ Optimization status updated to:', downloadData.status);

  // 8. Query back to confirm
  console.log('\n7. Querying optimization record to confirm final status...');
  const { data: finalData, error: finalError } = await supabase
    .from('optimizations')
    .select('id, status, updated_at')
    .eq('id', optId)
    .single();

  if (finalError) {
    console.error('   ✗ Query failed:', finalError.message);
    process.exit(1);
  }

  console.log('\n=== VERIFICATION RESULTS ===');
  console.log('Optimization ID:', finalData.id);
  console.log('Final Database Status:', finalData.status);
  console.log('Updated At Timestamp:', finalData.updated_at);

  if (finalData.status === 'downloaded') {
    console.log('\n🎉 SUCCESS: status = "downloaded" successfully verified in the database!');
  } else {
    console.log('\n❌ FAILURE: status did not match expected value "downloaded".');
    process.exit(1);
  }

  // Cleanup: delete user or test records to keep database clean
  console.log('\n8. Cleaning up verification database records...');
  await supabase.from('optimizations').delete().eq('id', optId);
  await supabase.from('job_descriptions').delete().eq('id', jdId);
  await supabase.from('resumes').delete().eq('id', resumeId);
  console.log('   ✓ Cleanup complete.');
}

main().catch(err => {
  console.error('\nVerification execution failed:', err.message);
  process.exit(1);
});
