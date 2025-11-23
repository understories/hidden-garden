# Debug Report: Test Failures - BigInt Serialization Issues

**Date:** 2025-01-XX  
**Issue:** TypeScript compilation errors and BigInt serialization failures in `tier_publisher.test.ts`  
**Status:** Partially Resolved (skill_profile tests pass, tier_publisher tests have separate issues)  
**Impact:** Prevents full test suite from passing

---

## Problem Summary

After implementing `getSkillProfile()` and its tests, running the full test suite revealed:

1. **TypeScript compilation errors** in `tier_publisher.test.ts` related to `jest.fn()` type inference
2. **BigInt serialization errors** when Jest tries to serialize mock transaction receipts
3. **Test timeout issues** (60s timeout) in some tier_publisher tests

The `skill_profile.test.ts` suite passes completely (16/16 tests), but the full suite fails due to pre-existing issues in `tier_publisher.test.ts`.

---

## Investigation Process

### Step 1: Initial Test Run

```bash
pnpm --filter @hidden-garden/core-logic test skill_profile
```

**Result:** ✅ All 16 tests passed

### Step 2: Full Test Suite Run

```bash
pnpm --filter @hidden-garden/core-logic test
```

**Result:** ❌ Test suite failed with TypeScript errors

**Error Messages:**
```
tests/tier_publisher.test.ts:182:52 - error TS2345: 
Argument of type '{ hash: `0x${string}`; }' is not assignable to parameter of type 'never'.
```

### Step 3: Root Cause Analysis

**Issue 1: TypeScript Type Inference**
- `jest.fn().mockResolvedValue()` was not properly typed
- TypeScript couldn't infer the return type, defaulting to `never`
- Solution: Explicitly type the mock function: `jest.fn<() => Promise<ethers.TransactionReceipt>>()`

**Issue 2: BigInt Serialization**
- Jest workers use `JSON.stringify()` to serialize data between processes
- `BigInt` values cannot be serialized by default
- `ethers.TransactionReceipt` contains `BigInt` fields (e.g., `gasUsed`, `cumulativeGasUsed`)
- Error: `TypeError: Do not know how to serialize a BigInt`

**Issue 3: Test Timeouts**
- Some tests hitting 60s timeout
- Likely related to async operations or network calls not being properly mocked

---

## Solutions Attempted

### Solution 1: Explicit Type Annotation ✅

**Problem:** `jest.fn()` type inference failing

**Fix:**
```typescript
// Before
const mockWait = jest.fn().mockResolvedValue({
  hash: mockTxHash,
});

// After
const mockWait = jest.fn<() => Promise<ethers.TransactionReceipt>>().mockResolvedValue({
  hash: mockTxHash,
  status: 1,
} as ethers.TransactionReceipt);
```

**Result:** ✅ Fixed TypeScript compilation errors

### Solution 2: Minimal Mock Receipt ✅

**Problem:** BigInt serialization in full `TransactionReceipt` objects

**Fix:**
```typescript
// Create minimal mock that avoids BigInt fields
const mockReceipt = {
  hash: mockTxHash,
  status: 1,
} as any;
const mockWait = jest.fn<() => Promise<ethers.TransactionReceipt>>()
  .mockResolvedValue(mockReceipt);
```

**Result:** ✅ Avoids BigInt serialization issues

### Solution 3: Convert BigInt to Number ❌

**Attempted:**
```typescript
gasUsed: 100000,  // Instead of 100000n
cumulativeGasUsed: 100000,
```

**Result:** ❌ Still failed - other BigInt fields or nested objects may contain BigInt

**Lesson:** Converting individual fields isn't sufficient if the type system expects BigInt

---

## Current Status

### ✅ Working
- `skill_profile.test.ts` - All 16 tests pass
- TypeScript compilation for `skill_profile.test.ts`
- Type annotations for mock functions

### ⚠️ Partially Working
- `tier_publisher.test.ts` - TypeScript errors fixed, but:
  - Some tests still timing out (60s)
  - BigInt serialization may still occur in other parts of the test

### 🔍 Remaining Issues

1. **Test Timeouts:**
   - `should submit tier proof when SBT check passes` - 60s timeout
   - `should use default skillPathId when not provided` - 60s timeout
   - Likely cause: Async operations not completing or infinite waits

2. **BigInt Serialization:**
   - May still occur if `ethers` types are deeply nested
   - Jest worker serialization can't handle BigInt by default

3. **Type Mismatches:**
   - `Expected: 1, Received: 1n` - BigInt vs Number comparison in assertions
   - Need to ensure consistent types in test expectations

---

## Lessons Learned

### 1. Type Safety in Mocks
**Problem:** `jest.fn()` without explicit types can cause TypeScript inference failures

**Solution:** Always provide explicit type parameters:
```typescript
jest.fn<() => Promise<ReturnType>>()
```

**Best Practice:** Type mocks explicitly to catch errors at compile time

### 2. BigInt Serialization
**Problem:** Jest workers serialize test data using JSON, which doesn't support BigInt

**Solution:** 
- Use minimal mocks that avoid BigInt fields
- Cast to `any` when necessary for test mocks
- Consider using `jest.setup.js` to add BigInt serialization support (if needed)

**Best Practice:** Keep mock objects minimal and avoid complex nested types with BigInt

### 3. Test Isolation
**Problem:** Pre-existing test failures can mask new issues

**Solution:**
- Run new test files in isolation first (`test skill_profile`)
- Fix pre-existing issues before integrating
- Use `describe.skip()` or `it.skip()` to temporarily disable failing tests during development

**Best Practice:** Ensure test suite is green before adding new tests

### 4. Async Test Timeouts
**Problem:** Tests timing out at 60s suggests async operations not completing

**Solution:**
- Ensure all mocks are properly set up before async operations
- Use `await` correctly for all async operations
- Check for unhandled promises or missing error handling

**Best Practice:** Set up mocks before async operations, ensure proper cleanup

---

## Recommended Next Steps

### Immediate Actions

1. **Fix Test Timeouts:**
   ```typescript
   // Ensure all async mocks are properly awaited
   // Check for missing `await` or unhandled promises
   ```

2. **Add BigInt Serialization Support (if needed):**
   ```javascript
   // jest.setup.js
   BigInt.prototype.toJSON = function() {
     return this.toString();
   };
   ```

3. **Fix Type Assertions:**
   ```typescript
   // Ensure consistent types in expectations
   expect(Number(value)).toBe(1); // Instead of expect(value).toBe(1n)
   ```

### Long-term Improvements

1. **Test Infrastructure:**
   - Add Jest configuration for BigInt support
   - Standardize mock patterns across test files
   - Create test utilities for common mock patterns

2. **Type Safety:**
   - Add stricter TypeScript config for tests
   - Use type guards in test assertions
   - Document expected types in test comments

3. **CI/CD:**
   - Run tests in isolation during development
   - Fail fast on TypeScript errors
   - Add test coverage reporting

---

## Code Examples

### ✅ Good: Explicitly Typed Mock
```typescript
const mockWait = jest.fn<() => Promise<ethers.TransactionReceipt>>()
  .mockResolvedValue({
    hash: mockTxHash,
    status: 1,
  } as any);
```

### ❌ Bad: Untyped Mock
```typescript
const mockWait = jest.fn().mockResolvedValue({
  hash: mockTxHash,
});
```

### ✅ Good: Minimal Mock (Avoids BigInt)
```typescript
const mockReceipt = {
  hash: mockTxHash,
  status: 1,
} as any;
```

### ❌ Bad: Full Type Mock (Contains BigInt)
```typescript
const mockReceipt: ethers.TransactionReceipt = {
  hash: mockTxHash,
  status: 1,
  gasUsed: 100000n, // BigInt - will fail serialization
  // ... other fields
};
```

---

## Debugging Commands Used

```bash
# Run specific test file
pnpm --filter @hidden-garden/core-logic test skill_profile

# Run full test suite
pnpm --filter @hidden-garden/core-logic test

# Check TypeScript compilation
pnpm --filter @hidden-garden/core-logic build

# Check linter errors
pnpm --filter @hidden-garden/core-logic lint

# Run with verbose output
pnpm --filter @hidden-garden/core-logic test --verbose
```

---

## Related Files

- `packages/core-logic/tests/skill_profile.test.ts` - ✅ All tests passing
- `packages/core-logic/tests/tier_publisher.test.ts` - ⚠️ Has timeout issues
- `packages/core-logic/src/skillProfile.ts` - Implementation
- `packages/core-logic/jest.config.js` - Jest configuration

---

## Team Recommendations

1. **Before Adding New Tests:**
   - Ensure existing test suite is green
   - Run new tests in isolation first
   - Fix pre-existing issues before integration

2. **When Writing Mocks:**
   - Always type mocks explicitly
   - Keep mock objects minimal
   - Avoid BigInt in serialized data

3. **When Debugging Test Failures:**
   - Run tests in isolation to identify specific failures
   - Check TypeScript compilation separately
   - Look for async/timeout issues
   - Verify mock setup is correct

4. **Test Infrastructure:**
   - Consider adding BigInt serialization support to Jest config
   - Create shared test utilities for common patterns
   - Document mock patterns in team wiki

---

## Conclusion

The `skill_profile` implementation and tests are complete and passing. The test suite failures are due to pre-existing issues in `tier_publisher.test.ts` that should be addressed separately. The debugging process revealed important lessons about:

- Type safety in Jest mocks
- BigInt serialization limitations
- Test isolation best practices
- Async test debugging

These lessons should be applied to future test development to prevent similar issues.

---

**Report Created By:** AI Assistant  
**Reviewed By:** [Pending Team Review]  
**Next Review Date:** After tier_publisher test fixes

