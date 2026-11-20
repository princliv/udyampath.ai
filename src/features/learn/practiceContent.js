export const dailyChallenges = [
    {
      id: 1,
      title: "Reverse a Linked List",
      difficulty: "Medium",
      category: "Data Structures",
      description: "Implement a function to reverse a singly linked list in-place.",
      problemStatement: "Given the head of a singly linked list, reverse the list and return the new head.",
      example: "Input: 1->2->3->4->5->NULL\nOutput: 5->4->3->2->1->NULL",
      constraints: [
        "The number of nodes in the list is in the range [0, 5000].",
        "-5000 <= Node.val <= 5000"
      ],
      solutionApproach: "Iterate through the list, changing the next pointer of each node to point to the previous node instead.",
      tags: ["Linked List", "Recursion", "Two Pointers"]
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "Easy",
      category: "Algorithms",
      description: "Determine if a string containing just parentheses is valid.",
      problemStatement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      example: "Input: s = \"()[]{}\"\nOutput: true",
      constraints: [
        "1 <= s.length <= 10^4",
        "s consists of parentheses only '()[]{}'."
      ],
      solutionApproach: "Use a stack to keep track of opening brackets. When encountering a closing bracket, check if it matches the top of the stack.",
      tags: ["Stack", "String"]
    },
    {
      id: 3,
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      category: "Trees",
      description: "Return the level order traversal of a binary tree's nodes.",
      problemStatement: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
      example: "Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]",
      constraints: [
        "The number of nodes in the tree is in the range [0, 2000].",
        "-1000 <= Node.val <= 1000"
      ],
      solutionApproach: "Use a queue to implement BFS, processing nodes level by level.",
      tags: ["Tree", "BFS", "Binary Tree"]
    },
    {
      id: 4,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      category: "Strings",
      description: "Find the length of the longest substring without repeating characters.",
      problemStatement: "Given a string s, find the length of the longest substring without repeating characters.",
      example: "Input: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.",
      constraints: [
        "0 <= s.length <= 5 * 10^4",
        "s consists of English letters, digits, symbols and spaces."
      ],
      solutionApproach: "Use a sliding window approach with a hash set to track characters in the current window.",
      tags: ["Hash Table", "Sliding Window", "String"]
    },
    {
      id: 5,
      title: "Merge Intervals",
      difficulty: "Medium",
      category: "Arrays",
      description: "Merge all overlapping intervals in a collection.",
      problemStatement: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      example: "Input: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]",
      constraints: [
        "1 <= intervals.length <= 10^4",
        "intervals[i].length == 2",
        "0 <= starti <= endi <= 10^4"
      ],
      solutionApproach: "Sort the intervals by start time, then merge adjacent intervals if they overlap.",
      tags: ["Array", "Sorting"]
    }
  ];

  export const learningTopics = [
    { 
      id: 1, 
      title: "React Hooks Deep Dive", 
      content: "React Hooks revolutionized functional components by providing state and lifecycle capabilities. Core hooks: useState (state management), useEffect (side effects), useContext (context API). Advanced hooks: useReducer (complex state logic), useCallback (memoized functions), useMemo (memoized values). Custom hooks enable logic reuse across components. Rules: Only call hooks at the top level, not conditionally. Common patterns: useFetch for API calls, useLocalStorage for persistence. Performance considerations: dependency arrays in useEffect, when to use useCallback/useMemo. The hooks ecosystem includes community hooks like useSWR for data fetching and react-use collection." 
    },
    { 
      id: 2, 
      title: "TypeScript Fundamentals", 
      content: "TypeScript brings static typing to JavaScript, catching errors during development. Key concepts: interfaces (shape of objects), types (type aliases), generics (reusable components). Advanced features: decorators (metadata programming), utility types (Partial, Pick, Omit), and type guards. Configuration via tsconfig.json controls strictness and compilation. Best practices: gradual adoption, proper any usage, and declaration files. Integration with React: FC type for components, typing hooks and props. TypeScript with Node.js involves typing modules and Express middleware. The ecosystem includes DefinitelyTyped for library type definitions." 
    },
    { 
      id: 3, 
      title: "Node.js Performance Optimization", 
      content: "Optimizing Node.js involves understanding the event loop and non-blocking I/O. Techniques: clustering (multi-core utilization), worker threads for CPU tasks, and proper error handling. Memory management: identifying leaks with heap snapshots, optimizing V8 garbage collection. Performance tools: Node's built-in profiler, clinic.js, and flame graphs. Database optimizations: connection pooling, query optimization, and caching strategies. Load balancing with Nginx or PM2. Security considerations: rate limiting, input validation, and dependency auditing. Real-world patterns: circuit breakers for failures, backpressure handling in streams." 
    },
    { 
      id: 4, 
      title: "CSS-in-JS Solutions Comparison", 
      content: "CSS-in-JS libraries solve scoping and dynamic styling challenges in components. Popular options: styled-components (template literals), Emotion (performance focused), JSS (framework agnostic). Features: theming support, SSR compatibility, and atomic CSS generation. Performance considerations: runtime vs compile-time solutions, critical CSS extraction. Advanced patterns: component variants, responsive props, and animation integration. Comparison with utility-first CSS like Tailwind. Tooling: Babel plugins, TypeScript support, and DevTools integration. Best practices: when to use CSS variables, extracting global styles, and testing strategies." 
    },
    { 
      id: 5, 
      title: "GraphQL API Design Principles", 
      content: "GraphQL enables declarative data fetching with a type system. Schema design: object types, interfaces, unions, and enums. Query patterns: pagination (connections/edges), filtering, and mutations. Performance: N+1 problem solutions (dataloaders), query complexity analysis. Security: depth limiting, persisted queries, and rate limiting. Federation: microservices architecture with Apollo Federation. Tooling: GraphiQL/Playground, schema stitching, and code generation. Best practices: versioning through evolution, documentation with SDL, and error handling. Real-world considerations: caching strategies and monitoring field usage." 
    },
    { 
      id: 6, 
      title: "Webpack 5 Modern Configuration", 
      content: "Webpack 5 offers improved build performance and module federation. Core concepts: entry points, output configuration, and loaders (file transformation). Plugins: HtmlWebpackPlugin, MiniCssExtractPlugin, and CleanWebpackPlugin. Optimization: code splitting (dynamic imports), tree shaking, and runtime chunk. Asset modules: replacing file/url loaders with built-in handling. Advanced features: module federation for microfrontends, persistent caching. Performance tuning: profiling build times, parallel thread loading. Configuration patterns: environment-specific files, composing configs with merge." 
    },
    { 
      id: 7, 
      title: "State Management in 2023", 
      content: "Modern state management balances client needs with developer experience. Options: Redux (predictable), Zustand (simplified), Jotai (atomic), and XState (FSM). Context API limitations and when to upgrade. Patterns: normalized state, derived state, and undo/redo implementations. Middleware: logging, persistence, and async handling. Server state management: React Query, SWR, and Apollo Client cache. Performance: selective component updates, memoization techniques. Developer tools: time travel debugging, state inspection. Emerging trends: colocation, compiler-assisted state management." 
    },
    { 
      id: 8, 
      title: "Microfrontends Architecture", 
      content: "Microfrontends extend microservices principles to the frontend. Implementation approaches: build-time (npm packages), run-time (module federation), iframes. Frameworks: Single SPA, Luigi, or custom solutions. Routing strategies: host-controlled vs federated. Shared dependencies: versioning strategies, externals configuration. Design systems: cross-team component libraries with documentation. Testing: integration strategies for independent teams. Performance: shared bundle optimization, lazy loading. Operational concerns: independent deployments, monitoring, and error tracking." 
    },
    { 
      id: 9, 
      title: "Progressive Web App Techniques", 
      content: "PWAs combine web and native app capabilities through service workers. Core components: manifest file (install prompt), service worker (offline caching), and app shell. Caching strategies: cache-first, network-first, and stale-while-revalidate. Background sync for deferred actions and push notifications. Performance: precaching critical assets, lazy loading routes. Testing: Lighthouse audits, offline scenarios, and storage quotas. Security: HTTPS requirement and content security policy. Advanced features: periodic sync, Web Share API, and file system access." 
    },
    { 
      id: 10, 
      title: "WebAssembly for Frontend Developers", 
      content: "WebAssembly enables near-native performance in the browser. Compilation targets: Rust, C/C++, and AssemblyScript. Integration: loading WASM modules in JavaScript, memory management. Use cases: image processing, physics simulations, and cryptography. Tooling: wasm-pack, Emscripten, and WebAssembly Studio. Performance considerations: startup overhead vs sustained throughput. Debugging: source maps and browser DevTools support. Future features: threads, SIMD, and exception handling. Real-world examples: FFmpeg in browser, AutoCAD Web, and Figma's performance optimizations." 
    }
];
