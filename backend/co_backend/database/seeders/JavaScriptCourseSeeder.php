<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\CourseLevel;
use App\Models\Chapter;
use App\Models\Lesson;
use App\Models\LessonContent;
use App\Models\Activity;
use App\Models\ChallengeTest;
use App\Models\ChallengeHint;
use App\Models\Skill;
use App\Models\Project;
use App\Models\ProjectRequirement;

class JavaScriptCourseSeeder extends Seeder
{
    public function run(): void
    {
        $track = \App\Models\Track::where('key', 'javascript')->first();

        // 1. Course Definition
        $course = Course::updateOrCreate(
            ['slug' => 'javascript-fundamentals'],
            [
                'title' => 'JavaScript Fundamentals',
                'description' => 'Master core JavaScript from the ground up through theory, hands-on practice, bug hunting, fixing broken logic, and building interactive software.',
                'short_description' => 'Variables, data types, operators, conditionals, loops, functions, and data structures.',
                'icon' => 'code',
                'color' => '#F7DF1E',
                'difficulty' => 'beginner',
                'is_published' => true,
                'sort_order' => 1,
                'track_id' => $track?->id,
                'glyph' => 'terminal',
            ]
        );

        // 2. Level 1: Fundamentals
        $level1 = CourseLevel::updateOrCreate(
            ['course_id' => $course->id, 'slug' => 'fundamentals'],
            [
                'title' => 'Level 1 — Core Fundamentals',
                'description' => 'Learn the building blocks of JavaScript: storage, computation, decision-making, repetition, and modular functions.',
                'sort_order' => 1,
                'unlock_threshold' => 0,
                'is_published' => true,
                'glyph' => 'terminal',
            ]
        );

        // ==========================================
        // CHAPTER 1: Variables & Data Types
        // ==========================================
        $ch1 = Chapter::updateOrCreate(
            ['course_level_id' => $level1->id, 'slug' => 'variables-and-data-types'],
            [
                'title' => 'Chapter 1: Variables & Data Types',
                'description' => 'Understand how programs store information in memory using let, const, and JavaScript primitive data types.',
                'sort_order' => 1,
                'mastery_threshold' => 80,
                'is_published' => true,
                'icon' => 'box',
            ]
        );

        // 1.1 Theory: What is a Variable?
        $l1_1 = Lesson::updateOrCreate(
            ['chapter_id' => $ch1->id, 'slug' => 'what-is-a-variable'],
            [
                'title' => '1.1 What is a Variable?',
                'type' => 'theory',
                'sort_order' => 1,
                'xp_reward' => 20,
                'difficulty' => 'easy',
                'estimated_minutes' => 5,
                'is_published' => true,
            ]
        );
        LessonContent::updateOrCreate(
            ['lesson_id' => $l1_1->id, 'sort_order' => 1],
            [
                'block_type' => 'text',
                'content' => [
                    'title' => 'Storing Data in Memory',
                    'body' => "A **variable** is a named container in your computer's memory that holds a value. Instead of remembering memory addresses or repeating identical values across your entire codebase, you give a value a descriptive name.",
                ]
            ]
        );
        LessonContent::updateOrCreate(
            ['lesson_id' => $l1_1->id, 'sort_order' => 2],
            [
                'block_type' => 'code',
                'content' => [
                    'language' => 'javascript',
                    'code' => "const appName = \"CodeOwl\";\nlet activeUsers = 42;\n\nconsole.log(appName); // Outputs: CodeOwl",
                    'caption' => 'Declaring variables with descriptive names'
                ]
            ]
        );
        LessonContent::updateOrCreate(
            ['lesson_id' => $l1_1->id, 'sort_order' => 3],
            [
                'block_type' => 'callout',
                'content' => [
                    'type' => 'note',
                    'title' => 'Best Practice',
                    'body' => 'Always use camelCase for naming variables in JavaScript (e.g. `totalScore`, `isLoggedIn`). Avoid single-letter names except in short loop counters.',
                ]
            ]
        );

        // 1.2 Interactive Example: Variables in Action
        $l1_2 = Lesson::updateOrCreate(
            ['chapter_id' => $ch1->id, 'slug' => 'variables-in-action'],
            [
                'title' => '1.2 Variables in Action',
                'type' => 'example',
                'sort_order' => 2,
                'xp_reward' => 25,
                'difficulty' => 'easy',
                'estimated_minutes' => 4,
                'is_published' => true,
            ]
        );
        $act1_2 = Activity::updateOrCreate(
            ['lesson_id' => $l1_2->id],
            [
                'instructions' => "Observe how variables can be declared and concatenated. Change the values of `firstName` and `score` and run the code to see live output.",
                'starter_code' => "const firstName = \"Karllo\";\nlet score = 100;\n\nconsole.log(\"Player:\", firstName);\nconsole.log(\"Initial Score:\", score);\n\nscore = score + 50;\nconsole.log(\"New Score:\", score);",
                'language' => 'javascript',
                'xp_reward' => 25,
            ]
        );

        // 1.3 Practice: Declare Your First Variables
        $l1_3 = Lesson::updateOrCreate(
            ['chapter_id' => $ch1->id, 'slug' => 'practice-declaring-variables'],
            [
                'title' => '1.3 Practice: Declare Variables',
                'type' => 'practice',
                'sort_order' => 3,
                'xp_reward' => 50,
                'difficulty' => 'easy',
                'estimated_minutes' => 6,
                'is_published' => true,
            ]
        );
        $act1_3 = Activity::updateOrCreate(
            ['lesson_id' => $l1_3->id],
            [
                'instructions' => "### Your Task\n\n1. Declare a constant named `userName` and set it to `\"Alex\"`.\n2. Declare a variable named `userLevel` and set it to `1`.\n3. Log both values using `console.log(userName, userLevel)`.\n\nWrite your solution completely from scratch.",
                'starter_code' => "// Write your solution here\n",
                'solution_code' => "const userName = \"Alex\";\nlet userLevel = 1;\nconsole.log(userName, userLevel);",
                'language' => 'javascript',
                'xp_reward' => 50,
                'xp_penalty_per_hint' => 10,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act1_3->id, 'sort_order' => 1],
            [
                'test_label' => 'Outputs Alex 1 to console',
                'test_code' => "if (!result.output.includes('Alex') || !result.output.includes('1')) { throw new Error('Expected output to contain Alex and 1'); }",
                'is_hidden' => false,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act1_3->id, 'sort_order' => 2],
            [
                'test_label' => 'userName and userLevel variables exist',
                'test_code' => "if (typeof userName === 'undefined' || typeof userLevel === 'undefined') { throw new Error('userName and userLevel must be declared'); }",
                'is_hidden' => true,
            ]
        );
        ChallengeHint::updateOrCreate(
            ['activity_id' => $act1_3->id, 'sort_order' => 1],
            [
                'hint_type' => 'conceptual',
                'content' => 'Use `const` for variables whose value won\'t be reassigned, and `let` for values that might change.',
                'xp_penalty' => 10,
            ]
        );
        ChallengeHint::updateOrCreate(
            ['activity_id' => $act1_3->id, 'sort_order' => 2],
            [
                'hint_type' => 'syntax_clue',
                'content' => 'Syntax:\n```javascript\nconst userName = "Alex";\nlet userLevel = 1;\nconsole.log(userName, userLevel);\n```',
                'xp_penalty' => 15,
            ]
        );

        // 1.4 Debug: Find the Variable Typo
        $l1_4 = Lesson::updateOrCreate(
            ['chapter_id' => $ch1->id, 'slug' => 'debug-variable-typo'],
            [
                'title' => '1.4 Debug: Find the Typo',
                'type' => 'debug',
                'sort_order' => 4,
                'xp_reward' => 80,
                'difficulty' => 'normal',
                'estimated_minutes' => 5,
                'is_published' => true,
            ]
        );
        $act1_4 = Activity::updateOrCreate(
            ['lesson_id' => $l1_4->id],
            [
                'instructions' => "### Bug Hunting\n\nThe code below throws a `ReferenceError` when executed because of a variable naming typo.\n\nFind the typo and fix it so `\"Welcome, Karllo! Level: 5\"` is logged.",
                'starter_code' => "const playerName = \"Karllo\";\nconst playerLevel = 5;\n\n// Bug is below:\nconsole.log(\"Welcome, \" + playrName + \"! Level: \" + playerLevel);",
                'solution_code' => "const playerName = \"Karllo\";\nconst playerLevel = 5;\nconsole.log(\"Welcome, \" + playerName + \"! Level: \" + playerLevel);",
                'language' => 'javascript',
                'xp_reward' => 80,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act1_4->id, 'sort_order' => 1],
            [
                'test_label' => 'Outputs Welcome, Karllo! Level: 5 without ReferenceError',
                'test_code' => "if (!result.output.includes('Welcome, Karllo! Level: 5')) { throw new Error('Expected output: Welcome, Karllo! Level: 5'); }",
                'is_hidden' => false,
            ]
        );

        // 1.5 Fix: Const Reassignment
        $l1_5 = Lesson::updateOrCreate(
            ['chapter_id' => $ch1->id, 'slug' => 'fix-const-reassignment'],
            [
                'title' => '1.5 Fix: Const Reassignment Bug',
                'type' => 'fix',
                'sort_order' => 5,
                'xp_reward' => 80,
                'difficulty' => 'normal',
                'estimated_minutes' => 6,
                'is_published' => true,
            ]
        );
        $act1_5 = Activity::updateOrCreate(
            ['lesson_id' => $l1_5->id],
            [
                'instructions' => "### The Problem\n\nA teammate declared `attempts` using `const`, but later tried to increment it, causing a `TypeError: Assignment to constant variable`.\n\n**Goal**: Change the declaration keyword so `attempts` can be reassigned properly.",
                'starter_code' => "const attempts = 1;\n\n// We need to increment attempts\nattempts = attempts + 1;\n\nconsole.log(\"Total attempts:\", attempts);",
                'solution_code' => "let attempts = 1;\nattempts = attempts + 1;\nconsole.log(\"Total attempts:\", attempts);",
                'language' => 'javascript',
                'xp_reward' => 80,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act1_5->id, 'sort_order' => 1],
            [
                'test_label' => 'Total attempts: 2 is logged without TypeError',
                'test_code' => "if (!result.output.includes('Total attempts: 2')) { throw new Error('Expected Total attempts: 2'); }",
                'is_hidden' => false,
            ]
        );

        // 1.6 Challenge: Build a User Profile Object
        $l1_6 = Lesson::updateOrCreate(
            ['chapter_id' => $ch1->id, 'slug' => 'challenge-profile-builder'],
            [
                'title' => '1.6 Challenge: Build Profile Record',
                'type' => 'challenge',
                'sort_order' => 6,
                'xp_reward' => 120,
                'difficulty' => 'hard',
                'estimated_minutes' => 10,
                'is_published' => true,
            ]
        );
        $act1_6 = Activity::updateOrCreate(
            ['lesson_id' => $l1_6->id],
            [
                'instructions' => "### From-Scratch Challenge\n\nBuild a function `formatProfile(username, score, isVerified)` that:\n1. Takes three parameters: `username` (string), `score` (number), `isVerified` (boolean).\n2. Returns a string in this exact format:\n`\"User: [username] | Score: [score] | Status: [VERIFIED / UNVERIFIED]\"`\n\nIf `isVerified` is true, Status is `VERIFIED`. Otherwise Status is `UNVERIFIED`.",
                'starter_code' => "function formatProfile(username, score, isVerified) {\n    // Write your code here\n}\n",
                'solution_code' => "function formatProfile(username, score, isVerified) {\n    const status = isVerified ? 'VERIFIED' : 'UNVERIFIED';\n    return 'User: ' + username + ' | Score: ' + score + ' | Status: ' + status;\n}",
                'language' => 'javascript',
                'xp_reward' => 120,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act1_6->id, 'sort_order' => 1],
            [
                'test_label' => 'Formats verified user correctly',
                'test_code' => "const res = formatProfile('Alice', 250, true);\nif (res !== 'User: Alice | Score: 250 | Status: VERIFIED') throw new Error('Received: ' + res);",
                'is_hidden' => false,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act1_6->id, 'sort_order' => 2],
            [
                'test_label' => 'Formats unverified user correctly',
                'test_code' => "const res = formatProfile('Bob', 0, false);\nif (res !== 'User: Bob | Score: 0 | Status: UNVERIFIED') throw new Error('Received: ' + res);",
                'is_hidden' => true,
            ]
        );

        // 1.7 Chapter Review: Chapter 1 Mastery Review
        $l1_7 = Lesson::updateOrCreate(
            ['chapter_id' => $ch1->id, 'slug' => 'chapter-1-review'],
            [
                'title' => '1.7 Chapter 1 Review & Mastery Check',
                'type' => 'chapter_review',
                'sort_order' => 7,
                'xp_reward' => 250,
                'difficulty' => 'hard',
                'estimated_minutes' => 15,
                'is_published' => true,
            ]
        );
        $act1_7 = Activity::updateOrCreate(
            ['lesson_id' => $l1_7->id],
            [
                'instructions' => "### Chapter 1 Capstone Challenge\n\nCreate a function `createPlayerSummary(name, xp)` that:\n1. If `xp` is 1000 or greater, sets rank to `\"PRO\"`.\n2. Otherwise sets rank to `\"NOVICE\"`.\n3. Returns an object: `{ name: name, xp: xp, rank: rank }`.",
                'starter_code' => "function createPlayerSummary(name, xp) {\n    // Build and return the object\n}\n",
                'solution_code' => "function createPlayerSummary(name, xp) {\n    const rank = xp >= 1000 ? 'PRO' : 'NOVICE';\n    return { name, xp, rank };\n}",
                'language' => 'javascript',
                'xp_reward' => 250,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act1_7->id, 'sort_order' => 1],
            [
                'test_label' => 'Creates PRO summary for 1200 XP',
                'test_code' => "const s = createPlayerSummary('Sarah', 1200);\nif (s.rank !== 'PRO' || s.name !== 'Sarah' || s.xp !== 1200) throw new Error('Invalid summary');",
                'is_hidden' => false,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act1_7->id, 'sort_order' => 2],
            [
                'test_label' => 'Creates NOVICE summary for 300 XP',
                'test_code' => "const s = createPlayerSummary('Leo', 300);\nif (s.rank !== 'NOVICE' || s.name !== 'Leo' || s.xp !== 300) throw new Error('Invalid summary');",
                'is_hidden' => true,
            ]
        );

        // ==========================================
        // CHAPTER 2: Operators & Expressions
        // ==========================================
        $ch2 = Chapter::updateOrCreate(
            ['course_level_id' => $level1->id, 'slug' => 'operators-and-expressions'],
            [
                'title' => 'Chapter 2: Operators & Expressions',
                'description' => 'Perform arithmetic calculations, strict equality checks, and logical evaluations in JavaScript.',
                'sort_order' => 2,
                'mastery_threshold' => 80,
                'is_published' => true,
                'icon' => 'plus-circle',
            ]
        );

        // 2.1 Theory: Operators
        $l2_1 = Lesson::updateOrCreate(
            ['chapter_id' => $ch2->id, 'slug' => 'arithmetic-and-logical-operators'],
            [
                'title' => '2.1 Arithmetic & Comparison Operators',
                'type' => 'theory',
                'sort_order' => 1,
                'xp_reward' => 20,
                'difficulty' => 'easy',
                'estimated_minutes' => 5,
                'is_published' => true,
            ]
        );
        LessonContent::updateOrCreate(
            ['lesson_id' => $l2_1->id, 'sort_order' => 1],
            [
                'block_type' => 'text',
                'content' => [
                    'title' => 'Computing and Comparing Values',
                    'body' => "JavaScript supports standard math operators: `+`, `-`, `*`, `/`, `%` (modulo), and `**` (exponent).\n\nWhen comparing values, **always use strict equality (`===`)** instead of loose equality (`==`). Strict equality verifies both value and type without silent type coercion.",
                ]
            ]
        );
        LessonContent::updateOrCreate(
            ['lesson_id' => $l2_1->id, 'sort_order' => 2],
            [
                'block_type' => 'code',
                'content' => [
                    'language' => 'javascript',
                    'code' => "console.log(5 === \"5\"); // false (number vs string)\nconsole.log(5 == \"5\");  // true (type coercion — avoid!)\nconsole.log(10 % 3);    // 1 (remainder)",
                    'caption' => 'Strict vs Loose Equality'
                ]
            ]
        );

        // 2.2 Practice: Calculate Total with Tax
        $l2_2 = Lesson::updateOrCreate(
            ['chapter_id' => $ch2->id, 'slug' => 'practice-calculate-tax'],
            [
                'title' => '2.2 Practice: Calculate Total With Tax',
                'type' => 'practice',
                'sort_order' => 2,
                'xp_reward' => 50,
                'difficulty' => 'easy',
                'estimated_minutes' => 6,
                'is_published' => true,
            ]
        );
        $act2_2 = Activity::updateOrCreate(
            ['lesson_id' => $l2_2->id],
            [
                'instructions' => "Write a function `calculateTotal(price, taxRate)` where `taxRate` is a percentage (e.g., 10 for 10%). Return the final price including tax.",
                'starter_code' => "function calculateTotal(price, taxRate) {\n    // Return price + tax\n}\n",
                'solution_code' => "function calculateTotal(price, taxRate) {\n    return price + (price * (taxRate / 100));\n}",
                'language' => 'javascript',
                'xp_reward' => 50,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act2_2->id, 'sort_order' => 1],
            [
                'test_label' => 'calculateTotal(100, 10) returns 110',
                'test_code' => "if (calculateTotal(100, 10) !== 110) throw new Error('Failed for 100 + 10%');",
                'is_hidden' => false,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act2_2->id, 'sort_order' => 2],
            [
                'test_label' => 'calculateTotal(50, 5) returns 52.5',
                'test_code' => "if (calculateTotal(50, 5) !== 52.5) throw new Error('Failed for 50 + 5%');",
                'is_hidden' => true,
            ]
        );

        // 2.3 Fix: Subtraction Instead of Addition
        $l2_3 = Lesson::updateOrCreate(
            ['chapter_id' => $ch2->id, 'slug' => 'fix-calculation-operator'],
            [
                'title' => '2.3 Fix: The Subtracting Discount Bug',
                'type' => 'fix',
                'sort_order' => 3,
                'xp_reward' => 80,
                'difficulty' => 'normal',
                'estimated_minutes' => 5,
                'is_published' => true,
            ]
        );
        $act2_3 = Activity::updateOrCreate(
            ['lesson_id' => $l2_3->id],
            [
                'instructions' => "The following function `applyDiscount(price, discountAmount)` is subtracting the discount twice or using inverted logic. Fix the calculation so it subtracts `discountAmount` from `price`.",
                'starter_code' => "function applyDiscount(price, discountAmount) {\n    return price + discountAmount; // Bug: It is adding instead of subtracting!\n}\n",
                'solution_code' => "function applyDiscount(price, discountAmount) {\n    return price - discountAmount;\n}",
                'language' => 'javascript',
                'xp_reward' => 80,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act2_3->id, 'sort_order' => 1],
            [
                'test_label' => 'applyDiscount(100, 20) returns 80',
                'test_code' => "if (applyDiscount(100, 20) !== 80) throw new Error('Expected 80');",
                'is_hidden' => false,
            ]
        );

        // ==========================================
        // CHAPTER 3: Conditionals & Logic
        // ==========================================
        $ch3 = Chapter::updateOrCreate(
            ['course_level_id' => $level1->id, 'slug' => 'conditionals-and-logic'],
            [
                'title' => 'Chapter 3: Conditionals & Decision Making',
                'description' => 'Control program execution flow using if, else if, else, ternary expressions, and switch statements.',
                'sort_order' => 3,
                'mastery_threshold' => 80,
                'is_published' => true,
                'icon' => 'git-branch',
            ]
        );

        $l3_1 = Lesson::updateOrCreate(
            ['chapter_id' => $ch3->id, 'slug' => 'challenge-grade-classifier'],
            [
                'title' => '3.1 Challenge: Letter Grade Classifier',
                'type' => 'challenge',
                'sort_order' => 1,
                'xp_reward' => 120,
                'difficulty' => 'normal',
                'estimated_minutes' => 8,
                'is_published' => true,
            ]
        );
        $act3_1 = Activity::updateOrCreate(
            ['lesson_id' => $l3_1->id],
            [
                'instructions' => "Build a function `getGrade(score)` that returns:\n- `\"A\"` if score >= 90\n- `\"B\"` if score >= 80\n- `\"C\"` if score >= 70\n- `\"D\"` if score >= 60\n- `\"F\"` for anything lower",
                'starter_code' => "function getGrade(score) {\n    // Your condition tree here\n}\n",
                'solution_code' => "function getGrade(score) {\n    if (score >= 90) return 'A';\n    if (score >= 80) return 'B';\n    if (score >= 70) return 'C';\n    if (score >= 60) return 'D';\n    return 'F';\n}",
                'language' => 'javascript',
                'xp_reward' => 120,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act3_1->id, 'sort_order' => 1],
            [
                'test_label' => 'Scores 95 -> A, 82 -> B, 74 -> C',
                'test_code' => "if (getGrade(95) !== 'A' || getGrade(82) !== 'B' || getGrade(74) !== 'C') throw new Error('Failed standard grades');",
                'is_hidden' => false,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act3_1->id, 'sort_order' => 2],
            [
                'test_label' => 'Scores 60 -> D, 59 -> F',
                'test_code' => "if (getGrade(60) !== 'D' || getGrade(59) !== 'F') throw new Error('Failed cutoff boundary');",
                'is_hidden' => true,
            ]
        );

        // ==========================================
        // CHAPTER 4: Loops & Iteration
        // ==========================================
        $ch4 = Chapter::updateOrCreate(
            ['course_level_id' => $level1->id, 'slug' => 'loops-and-iteration'],
            [
                'title' => 'Chapter 4: Loops & Iteration',
                'description' => 'Automate repetitive tasks with for loops, while loops, and array iterators.',
                'sort_order' => 4,
                'mastery_threshold' => 80,
                'is_published' => true,
                'icon' => 'repeat',
            ]
        );

        $l4_1 = Lesson::updateOrCreate(
            ['chapter_id' => $ch4->id, 'slug' => 'challenge-fizzbuzz'],
            [
                'title' => '4.1 Challenge: Classic FizzBuzz',
                'type' => 'challenge',
                'sort_order' => 1,
                'xp_reward' => 120,
                'difficulty' => 'normal',
                'estimated_minutes' => 10,
                'is_published' => true,
            ]
        );
        $act4_1 = Activity::updateOrCreate(
            ['lesson_id' => $l4_1->id],
            [
                'instructions' => "Write a function `fizzBuzz(n)` that returns an array of numbers from 1 to `n`, but:\n- For multiples of 3, replace with `\"Fizz\"`\n- For multiples of 5, replace with `\"Buzz\"`\n- For multiples of both 3 and 5, replace with `\"FizzBuzz\"`",
                'starter_code' => "function fizzBuzz(n) {\n    // Return array of results\n}\n",
                'solution_code' => "function fizzBuzz(n) {\n    const res = [];\n    for (let i = 1; i <= n; i++) {\n        if (i % 15 === 0) res.push('FizzBuzz');\n        else if (i % 3 === 0) res.push('Fizz');\n        else if (i % 5 === 0) res.push('Buzz');\n        else res.push(i);\n    }\n    return res;\n}",
                'language' => 'javascript',
                'xp_reward' => 120,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act4_1->id, 'sort_order' => 1],
            [
                'test_label' => 'fizzBuzz(5) returns [1, 2, "Fizz", 4, "Buzz"]',
                'test_code' => "const r = fizzBuzz(5);\nif (JSON.stringify(r) !== JSON.stringify([1, 2, 'Fizz', 4, 'Buzz'])) throw new Error('Failed 5');",
                'is_hidden' => false,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act4_1->id, 'sort_order' => 2],
            [
                'test_label' => 'Multiples of 15 replaced by FizzBuzz',
                'test_code' => "const r = fizzBuzz(15);\nif (r[14] !== 'FizzBuzz') throw new Error('15 should be FizzBuzz');",
                'is_hidden' => true,
            ]
        );

        // ==========================================
        // CHAPTER 5: Functions & Scope
        // ==========================================
        $ch5 = Chapter::updateOrCreate(
            ['course_level_id' => $level1->id, 'slug' => 'functions-and-scope'],
            [
                'title' => 'Chapter 5: Functions & Scope',
                'description' => 'Master pure functions, arrow syntax, parameters, return values, and lexical scope.',
                'sort_order' => 5,
                'mastery_threshold' => 80,
                'is_published' => true,
                'icon' => 'code',
            ]
        );

        $l5_1 = Lesson::updateOrCreate(
            ['chapter_id' => $ch5->id, 'slug' => 'challenge-calculate-discount'],
            [
                'title' => '5.1 Challenge: calculateDiscount',
                'type' => 'challenge',
                'sort_order' => 1,
                'xp_reward' => 120,
                'difficulty' => 'normal',
                'estimated_minutes' => 8,
                'is_published' => true,
            ]
        );
        $act5_1 = Activity::updateOrCreate(
            ['lesson_id' => $l5_1->id],
            [
                'instructions' => "Build a function called `calculateDiscount` that accepts `price` (number) and `discountPercent` (number). Return the final discounted price.\n\nExample: `calculateDiscount(100, 20)` should return `80`.",
                'starter_code' => "// Build function calculateDiscount\n",
                'solution_code' => "function calculateDiscount(price, discountPercent) {\n    return price - (price * (discountPercent / 100));\n}",
                'language' => 'javascript',
                'xp_reward' => 120,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act5_1->id, 'sort_order' => 1],
            [
                'test_label' => 'calculateDiscount(100, 20) returns 80',
                'test_code' => "if (calculateDiscount(100, 20) !== 80) throw new Error('Failed 100, 20');",
                'is_hidden' => false,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act5_1->id, 'sort_order' => 2],
            [
                'test_label' => 'Handles 0% and 100% discount edge cases',
                'test_code' => "if (calculateDiscount(50, 0) !== 50 || calculateDiscount(50, 100) !== 0) throw new Error('Failed edge cases');",
                'is_hidden' => true,
            ]
        );

        // ==========================================
        // CHAPTER 6: Arrays & Objects
        // ==========================================
        $ch6 = Chapter::updateOrCreate(
            ['course_level_id' => $level1->id, 'slug' => 'arrays-and-objects'],
            [
                'title' => 'Chapter 6: Arrays & Objects',
                'description' => 'Work with collections, list transformations, object properties, and key/value mappings.',
                'sort_order' => 6,
                'mastery_threshold' => 80,
                'is_published' => true,
                'icon' => 'layers',
            ]
        );

        $l6_1 = Lesson::updateOrCreate(
            ['chapter_id' => $ch6->id, 'slug' => 'practice-filter-and-map'],
            [
                'title' => '6.1 Practice: Array Filter & Transform',
                'type' => 'practice',
                'sort_order' => 1,
                'xp_reward' => 80,
                'difficulty' => 'normal',
                'estimated_minutes' => 8,
                'is_published' => true,
            ]
        );
        $act6_1 = Activity::updateOrCreate(
            ['lesson_id' => $l6_1->id],
            [
                'instructions' => "Write a function `getActiveUserNames(users)` where `users` is an array of objects `{ id, name, isActive }`. Return an array containing only the names of active users.",
                'starter_code' => "function getActiveUserNames(users) {\n    // Return array of active names\n}\n",
                'solution_code' => "function getActiveUserNames(users) {\n    return users.filter(u => u.isActive).map(u => u.name);\n}",
                'language' => 'javascript',
                'xp_reward' => 80,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act6_1->id, 'sort_order' => 1],
            [
                'test_label' => 'Returns active user names',
                'test_code' => "const users = [{id:1, name:'Alex', isActive:true}, {id:2, name:'Sam', isActive:false}, {id:3, name:'Jo', isActive:true}];\nconst res = getActiveUserNames(users);\nif (JSON.stringify(res) !== JSON.stringify(['Alex', 'Jo'])) throw new Error('Failed active check');",
                'is_hidden' => false,
            ]
        );

        // 6.2 Final Level Review: Grade Calculator
        $l_lvl_rev = Lesson::updateOrCreate(
            ['chapter_id' => $ch6->id, 'slug' => 'level-1-final-review'],
            [
                'title' => '6.2 Final Level 1 Review: Student Grade Analytics',
                'type' => 'level_review',
                'sort_order' => 2,
                'xp_reward' => 500,
                'difficulty' => 'expert',
                'estimated_minutes' => 20,
                'is_published' => true,
            ]
        );
        $act_lvl_rev = Activity::updateOrCreate(
            ['lesson_id' => $l_lvl_rev->id],
            [
                'instructions' => "### Level 1 Capstone Challenge\n\nBuild `analyzeGrades(scores)` that takes an array of numeric test scores and returns an object:\n```javascript\n{\n  average: 84.5, // rounded or precise\n  highest: 98,\n  passedCount: 4 // count of scores >= 70\n}\n```\nIf scores array is empty, return `{ average: 0, highest: 0, passedCount: 0 }`.",
                'starter_code' => "function analyzeGrades(scores) {\n    // Combine variables, loops, arrays, and conditionals\n}\n",
                'solution_code' => "function analyzeGrades(scores) {\n    if (!scores || scores.length === 0) return { average: 0, highest: 0, passedCount: 0 };\n    let sum = 0, highest = -Infinity, passedCount = 0;\n    for (let s of scores) {\n        sum += s;\n        if (s > highest) highest = s;\n        if (s >= 70) passedCount++;\n    }\n    return {\n        average: sum / scores.length,\n        highest,\n        passedCount\n    };\n}",
                'language' => 'javascript',
                'xp_reward' => 500,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act_lvl_rev->id, 'sort_order' => 1],
            [
                'test_label' => 'Analyzes [80, 90, 60, 100] accurately',
                'test_code' => "const res = analyzeGrades([80, 90, 60, 100]);\nif (res.average !== 82.5 || res.highest !== 100 || res.passedCount !== 3) throw new Error('Analysis incorrect: ' + JSON.stringify(res));",
                'is_hidden' => false,
            ]
        );
        ChallengeTest::updateOrCreate(
            ['activity_id' => $act_lvl_rev->id, 'sort_order' => 2],
            [
                'test_label' => 'Handles empty array edge case',
                'test_code' => "const res = analyzeGrades([]);\nif (res.average !== 0 || res.highest !== 0 || res.passedCount !== 0) throw new Error('Empty array failed');",
                'is_hidden' => true,
            ]
        );

        // 3. Final Course Project
        $proj = Project::updateOrCreate(
            ['course_id' => $course->id, 'slug' => 'interactive-quiz-app'],
            [
                'title' => 'Interactive Quiz Application',
                'description' => 'Build a fully-featured interactive quiz engine in JavaScript that loads questions, tracks player score, validates choices, and presents final performance feedback.',
                'difficulty' => 'normal',
                'xp_reward' => 600,
                'is_published' => true,
            ]
        );
        ProjectRequirement::updateOrCreate(
            ['project_id' => $proj->id, 'sort_order' => 1],
            ['title' => 'Question Bank Model', 'description' => 'Maintain an array of question objects with question text, options, and correct index.', 'is_required' => true]
        );
        ProjectRequirement::updateOrCreate(
            ['project_id' => $proj->id, 'sort_order' => 2],
            ['title' => 'Score Computation', 'description' => 'Track total correct answers and calculate accuracy percentage.', 'is_required' => true]
        );
        ProjectRequirement::updateOrCreate(
            ['project_id' => $proj->id, 'sort_order' => 3],
            ['title' => 'Streak Bonus', 'description' => 'Award extra bonus score for consecutive correct answers.', 'is_required' => false]
        );

        // 4. Skills Tree
        $sk1 = Skill::updateOrCreate(['course_id' => $course->id, 'slug' => 'variables'], ['title' => 'Variables & Storage', 'description' => 'let, const, memory containers', 'icon' => 'box', 'sort_order' => 1]);
        $sk2 = Skill::updateOrCreate(['course_id' => $course->id, 'slug' => 'operators'], ['title' => 'Operators & Logic', 'description' => 'Arithmetic, strict equality, boolean logic', 'icon' => 'plus-circle', 'sort_order' => 2]);
        $sk3 = Skill::updateOrCreate(['course_id' => $course->id, 'slug' => 'conditionals'], ['title' => 'Control Flow', 'description' => 'if/else branching and guard clauses', 'icon' => 'git-branch', 'sort_order' => 3]);
        $sk4 = Skill::updateOrCreate(['course_id' => $course->id, 'slug' => 'loops'], ['title' => 'Iteration & Repetition', 'description' => 'for and while loops', 'icon' => 'repeat', 'sort_order' => 4]);
        $sk5 = Skill::updateOrCreate(['course_id' => $course->id, 'slug' => 'functions'], ['title' => 'Functions & Modularity', 'description' => 'Pure functions, scope, and closures', 'icon' => 'code', 'sort_order' => 5]);
        $sk6 = Skill::updateOrCreate(['course_id' => $course->id, 'slug' => 'data-structures'], ['title' => 'Arrays & Objects', 'description' => 'Collections and record structures', 'icon' => 'layers', 'sort_order' => 6]);
    }
}
