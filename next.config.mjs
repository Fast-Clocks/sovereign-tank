/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⚠️ STILL SUPPRESSING 11 TYPE ERRORS — this is not "clean", it is bounded.
  //
  // This flag previously hid 43 errors silently. 32 have been fixed, including
  // several real runtime bugs (see the PR). The 11 that remain are ALL the
  // AI SDK v5 -> v6 `useChat` migration, confined to two files:
  //   components/ai-assistant-chat.tsx   (6)
  //   components/ai-command-terminal.tsx (5)
  //
  // They are not fixed here on purpose. v6 removed `input`/`handleInputChange`/
  // `handleSubmit`, replaced `isLoading` with `status`, `append` with
  // `sendMessage`, moved `api` into a transport, and changed messages from
  // `message.content` to a `parts` array. That is a behavioural rewrite of the
  // chat UI which a passing type-check would NOT prove correct, and it cannot be
  // validated without running the app against a live model.
  //
  // REMOVE THIS FLAG as soon as that migration lands. Until then `npm run
  // typecheck` is the honest signal — run it and expect exactly 11.
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig
