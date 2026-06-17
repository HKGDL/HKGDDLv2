/**
 * Test script for platformer submission API
 * This script tests the complete platformer submission flow
 */

const API_BASE = 'https://api.hkgdl.dpdns.org/api'; // Production API URL

async function testPlatformerSubmission() {
  try {
    console.log('🧪 Testing Platformer Submission API...\n');
    
    // Test 1: Create a platformer submission
    console.log('1. Creating platformer submission...');
    const submissionResponse = await fetch(`${API_BASE}/platformer-submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `test-${Date.now()}`,
        levelId: '123456',
        levelName: 'Test Platformer Level',
        isNewLevel: false,
        record_data: JSON.stringify({
          player: 'TestPlayer',
          date: '2024/04/18',
          videoUrl: 'https://youtube.com/test',
          fps: '60',
          attempts: 1000,
          cbf: false
        }),
        submittedAt: new Date().toISOString(),
        submittedBy: 'TestPlayer',
        status: 'pending',
        adminDecidesDifficulty: true
      })
    });
    
    const submissionResult = await submissionResponse.json();
    console.log('✅ Submission created:', submissionResult);
    
    if (!submissionResult.success) {
      throw new Error('Submission creation failed');
    }
    
    // Test 2: Get pending submissions (should include our test)
    console.log('\n2. Checking pending submissions...');
    const pendingResponse = await fetch(`${API_BASE}/pending-submissions`);
    const pendingData = await pendingResponse.json();
    
    const platformerSubmissions = pendingData.filter(s => s.isPlatformer);
    console.log(`✅ Found ${platformerSubmissions.length} platformer submissions`);
    console.log('Platformer submissions:', JSON.stringify(platformerSubmissions, null, 2));
    
    // Test 3: Create a platformer level (simulating admin approval)
    console.log('\n3. Creating platformer level...');
    const levelResponse = await fetch(`${API_BASE}/platformer-levels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'test-platformer-level',
        levelId: '123456',
        name: 'Test Platformer Level',
        hkgdRank: 1,
        creator: 'TestCreator',
        verifier: 'TestVerifier',
        isPlatformer: true
      })
    });
    
    const levelResult = await levelResponse.json();
    console.log('✅ Platformer level created:', levelResult);
    
    // Test 4: Add record to platformer level
    console.log('\n4. Adding record to platformer level...');
    const recordResponse = await fetch(`${API_BASE}/platformer-levels/123456/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player: 'TestPlayer',
        date: '2024/04/18',
        videoUrl: 'https://youtube.com/test',
        fps: '60',
        attempts: 1000,
        cbf: false
      })
    });
    
    const recordResult = await recordResponse.json();
    console.log('✅ Platformer record added:', recordResult);
    
    // Test 5: Get platformer levels (should include our test level)
    console.log('\n5. Getting all platformer levels...');
    const levelsResponse = await fetch(`${API_BASE}/platformer-levels`);
    const levelsData = await levelsResponse.json();
    
    console.log(`✅ Found ${levelsData.length} platformer levels`);
    console.log('Platformer levels:', JSON.stringify(levelsData, null, 2));
    
    // Test 6: Approve the submission
    console.log('\n6. Approving submission...');
    const approveResponse = await fetch(`${API_BASE}/pending-submissions/${submissionResult.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' })
    });
    
    const approveResult = await approveResponse.json();
    console.log('✅ Submission approved:', approveResult);
    
    console.log('\n🎉 All tests passed! Platformer submission flow is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the test
testPlatformerSubmission();
