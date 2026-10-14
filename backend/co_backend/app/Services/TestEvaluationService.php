<?php
namespace App\Services;
use App\Models\Activity;
class TestEvaluationService {
    public function __construct(protected CodeExecutionService $executionService) {}

    public function evaluate(Activity $activity, string $userCode): array {
        $tests = $activity->challengeTests;
        $testCode = "const assert = require('assert'); result.tests = [];\n";
        
        foreach($tests as $idx => $t) {
            $label = addslashes($t->test_label);
            $testCode .= "try {\n  " . $t->test_code . "\n  result.tests.push({ label: '{$label}', passed: true, is_hidden: " . ($t->is_hidden ? 'true' : 'false') . " });\n} catch(e) {\n  result.tests.push({ label: '{$label}', passed: false, error: e.message, is_hidden: " . ($t->is_hidden ? 'true' : 'false') . " });\n}\n";
        }

        $execResult = $this->executionService->execute(
            $userCode,
            $activity->language ?? 'javascript',
            $activity->time_limit_seconds ?? 10,
            128,
            $testCode
        );

        $results = $execResult['tests'] ?? [];
        $passed = count(array_filter($results, fn($t) => !empty($t['passed'])));
        $total = count($tests);

        return array_merge($execResult, [
            'success' => $passed === $total && $total > 0,
            'tests_passed' => $passed,
            'tests_total' => $total,
            'test_results' => $results,
        ]);
    }
}
