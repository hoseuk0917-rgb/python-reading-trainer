# V328-A0 current UX structure inventory

## Purpose

Before changing the UI again, capture the current render structure of code explanation, command explanation, and project analysis.

## Files inspected

### src/pwa/index.html

- Lines: 389
- App/version mentions: 20260619_v327_a3
- DOM ids: againBtn, analyzeCodeBtn, analyzeCommandBtn, analyzeProjectProbeBtn, cardMemo, cardTitle, choices, clearCodeBtn, clearCommandBtn, clearProjectAnalyzerBtn, closeLargeDiagramBtn, codeBlock, codeConfidenceReport, codeDetectionDetails, codeExplainerVersion, codeFlowAnalysisReport, codeInput, codeLangHint, codeLangSelect, codeQuickReport, codeRelatedCards, codeSteps, codeStructureOverview, codeSummary, codeView, codeWarnings, commandExplainerVersion, commandInput, commandModeHint, commandNextChecks, commandSampleDescription, commandSampleSelect, commandShellSelect, commandSteps, commandSummary, commandView, commandWarnings, conceptDefinition, conceptExample, conceptIntro, conceptMemo, conceptTitle, copyCodeReportBtn, copyDiagramSvgBtn, copyMermaidBtn, copyProjectProbeCommandBtn, diagramLargeBody, diagramLargeModal, diagramLargeTitle, diagramStatus, downloadDiagramSvgBtn, downloadNotesBtn, generateProjectProbeBtn, learnView, levelBadge, loadCodeSampleBtn, loadCommandSampleBtn, mermaidDiagram, mermaidSource, nextBtn, notesList, notesView, openLargeDiagramBtn, outlineList, outlineSummary, outlineView, prevBtn, progressDashboard, progressText, progressView, projectAnalysisDetails, projectAnalysisSummary, projectAnalyzerVersion, projectContext, projectDiagramStatus, projectMermaidDiagram, projectMermaidSource, projectProbeCommand, projectProbeOutput, projectRootInput
- Render functions: none
- Functions: none
- `<details>` count: 3
- `<summary>` count: 3
- UX tokens:
  - codeFlow: true
  - codeRelated: true
  - commandNextChecks: true
  - functionFlow: false
  - nextCheckAdvisor: false
  - pasteBackHint: false
  - projectAnalyzer: true

### src/pwa/app.js

- Lines: 3358
- App/version mentions: 20260619_v327_a3
- DOM ids: studyQueueClearV72, studyQueueDoneV72, studyQueueFirstV72, studyQueueNextV72, studyQueueResetV72, studyToolsApply, studyToolsClear, studyToolsLevel, studyToolsMode, studyToolsQuery, studyToolsQueue, studyToolsQueueStatusV72, studyToolsRandom, studyToolsRecommendApplyV272, studyToolsRecommendStartV272, studyToolsRecommendSummaryV272, studyToolsStatus, studyToolsToday, studyToolsToggleV272
- Render functions: renderCard, renderConceptDetail, renderConceptIntroV306, renderExternalResources, renderMobileSideTeaser, renderNotesList, renderOutline, renderProgress, renderQueueList, renderReadingGoalV306, renderSideCards
- Functions: applyMicroUi, applyRecommendedProgress, applyStudyToolsFilter, buildConceptIntroV306, buildSafeSideCardIntroTextV306, cardMemoKey, cardText, checkAnswer, clearQueueAll, clearQueueProgressOnly, clearStudyToolsFilter, closeOtherItems, collectNotes, conceptMemoKey, createTodayStudyQueue, currentQueueIndex, downloadNotes, enhance, enhanceStudyToolsPanel, ensureQueueToolsStyle, filterCards, forceCollapsedOnMobileDefault, getAllConcepts, getBonusSideCards, getCardConceptsV306, getCollapsedDefault, getCurrentCard, getCurrentCardIdSafe, getExternalResourceMatches, getFullText, getLevelOptions, getPrimaryConceptV306, getProgressForRecommend, getProgressSafe, getProgressSafeV274, getQueueCards, getRecommendSummary, getRecommendedLevel, getSelectedText, getSideCardById, getSideDetail, getSideText, init, injectQueueNav, injectStudyToolsPanel, injectStudyToolsStyle, injectStudyToolsUxPatchStyle, isSmallScreen, jumpQueueFirst, jumpQueueNext, jumpRandomStudyCard, jumpToConfusedOrNext, loadCardMemo, loadConceptMemo, loadProgress, loadQueueProgress, loadSideSeen, loadToolsState, loadToolsStateForRecommend, loadToolsStateSafe, loadToolsStateSafeV274, makeMicroSummary, makeSectionTitle, makeSideCard, makeTodayQueue, markConfused, markCorrect, markCurrentQueueDone, markSeen, markSideSeen, nextCard, normalizeAnswer, normalizeConceptIntroTextV306, normalizeResourceText, pickConceptIntroSideCardV306, pickRandomBackgroundCard, prevCard, readPanelState, recommendLevelV274, refreshHelp, refreshQueueTools, refreshStudyToolsPanel, renderCard, renderConceptDetail, renderConceptIntroV306, renderExternalResources, renderMobileSideTeaser, renderNotesList, renderOutline, renderProgress, renderQueueList, renderReadingGoalV306, renderSideCards, resetProgress, saveCardMemo, saveConceptMemo, saveProgress, saveQueueProgress, saveSideSeen, saveToolsState
- `<details>` count: 0
- `<summary>` count: 0
- UX tokens:
  - codeFlow: false
  - codeRelated: false
  - commandNextChecks: false
  - functionFlow: false
  - nextCheckAdvisor: false
  - pasteBackHint: false
  - projectAnalyzer: true

### src/pwa/code_explainer.js

- Lines: 5165
- App/version mentions: none
- DOM ids: functionCallGraphDiagramV262, functionMermaidDiagramV253_
- Render functions: renderConfidenceReport, renderContextItemListV261, renderDetectionDetails, renderFlowAnalysisReport, renderFlowList, renderFlowPills, renderFunctionCallGraphDiagramV262, renderFunctionFlowAdvisorV327A3, renderFunctionInterpretationListV251, renderFunctionMermaidDiagramsV253, renderFunctionPickerControlsV260, renderFunctionPickerV259, renderFunctionRelatedCardsV254, renderFunctionSkeletonV259, renderId, renderInternalCallGroupsV272, renderInternalCallListV261, renderLongStepNoticeElement, renderMermaid, renderMermaidSvgNow, renderQuickReport, renderRelatedCards, renderSelectedFunctionCallGraphV262, renderSelectedFunctionContextV261, renderStepItem, renderStepMeta, renderSteps, renderStructureOverview, renderWarnings, render_ui, rendered, renderedSteps
- Functions: add, addBox, addConceptsV274, addConceptsV302, addDiamond, addJsConceptsV303, addJsPickerBlockV259, addMermaidConceptsV304, addOutlineItem, addUniqueByNameV251, addUniqueJsByNameV256, analyzeCurrentCode, analyzeExternalCodeSnippet, appendUniqueJsStepV257, appendUniqueJsStepV303, appendUniqueMermaidStepV304, appendUniqueQualityStepV274, appendUniqueStepV252, appendUniqueStepV302, applyMermaidQualityModeV304, buildFunctionInterpretationsV251, buildFunctionOutlineV259, buildFunctionSkeletonV259, buildInternalCallGroupsV272, buildJsBlockFromMatchV257, buildJsEventCallbackBlockV303, buildJsFunctionInterpretationsV256, buildJsFunctionInterpretationsV257, buildJsFunctionMermaidV256, buildJsFunctionMermaidV303, buildJsQualityHintsV274, buildLongCodeOverview, buildMermaidQualityGuideV304, buildPlainTextReport, buildPythonFunctionConceptsV251, buildPythonFunctionInterpretationsV251, buildPythonFunctionMermaidV251, buildPythonFunctionMermaidV302, buildPythonQualityHintsV274, buildReadingOrder, buildSelectedFunctionCallGraphMermaidV262, buildSelectedFunctionContextV261, buildSelectedFunctionInterpretationV259, chooseMermaidQualityModeV304, classifyFunctionSkeletonRoleV259, classifyInternalCallGroupV272, clearInput, closeLargeDiagram, collectFunctionRelatedKeywordsV254, confidenceClass, confidenceLabel, copyCodeReport, copyDiagramSvg, copyMermaid, countByValue, countJsFunctionHeadersV303, countPythonFunctionHeadersV302, dedupeJsBlocksV257, detectJsFunctionSignalsV257, detectPythonFunctionSignalsV252, downloadDiagramSvg, el, enhanceJsFunctionInterpretationsV257, enhanceJsQualityHintsV274, enhancePythonFunctionInterpretationsV252, enhancePythonQualityHintsV274, escapeHtml, escapeRegExpV261, extractCodeOutline, extractJsEventCallbackBlocksV303, extractJsExtraFunctionBlocksV257, extractJsFunctionBlocksForPickerV259, extractJsFunctionBlocksV256, extractJsFunctionBlocksV257, extractPythonFunctionBlocksV251, extractPythonImportsV252, extractRelatedKeywords, filterFunctionOutlineV260, findFunctionCallersV261, findFunctionRelatedCardsV254, findMatchingBraceV256, findRelatedCards, flattenInternalCallGroupsV272, formatCountSummary, getCardBodyV254, getCardSearchTextV254, getCardTitleV254, getCurrentDiagramSvg, getDetectionReasons, getFunctionBodyTextV259, getFunctionInternalCallsV261, getFunctionSkeletonRoleLabelV259, getFunctionSnippetTextV261, getInternalCallGroupLabelV272, getJsFunctionBodyForIrV257, getLastAnalysisV259, getOutlineFunctionNameSetV272, getPickerRoleOptionsV260, getPythonFunctionBodyForIrV252, getPythonFunctionKindLabelV302
- `<details>` count: 16
- `<summary>` count: 16
- UX tokens:
  - codeFlow: true
  - codeRelated: true
  - commandNextChecks: false
  - functionFlow: true
  - nextCheckAdvisor: true
  - pasteBackHint: true
  - projectAnalyzer: true

### src/pwa/code_explainer_rules.js

- Lines: 3272
- App/version mentions: none
- DOM ids: none
- Render functions: none
- Functions: add, addCallFlowItem, addDataFlowItem, analyze, buildMermaid, buildNextCheckAdvisorV326A4, cleanLine, collectCallFlow, collectDataFlow, collectFunctionFlowV326A4, collectLocalDefinitions, collectUnsupportedItems, compactV326A4, confidenceForStep, confidenceLabel, detectLanguage, explainDockerfileLine, explainEnvFileLine, explainGitHubActionsLine, explainGitignoreLine, explainIniLine, explainJavaLine, explainJavaScriptLine, explainMarkdownLine, explainPackageJsonLine, explainPowerShellLine, explainPyprojectLine, explainPythonLine, explainRequirementsLine, explainTomlLine, explainYamlLine, extractDataFlowNames, inferStepMeta, isBlankOrComment, isDataFlowNoiseName, isKnownPowerShellCommand, isKnownStandaloneCall, isStructuralOnlyLine, logicalLines, makeStep, mermaidClassForStep, mermaidEdgeLabel, mermaidLabel, mermaidNodeLine, pushUnique, pushUnknownCallName, pythonIndentV326A4, refineUnknownCallConfidence, riskOf, splitParamsV326A4, stripFence, stripPythonCommentV326A4, stripQuotedStrings, summarize, summarizeConfidence, summarizeFlow, trimSourcePreview, uniqueNames, unknownAssignmentCallName, unknownAssignmentCallNames, unsupportedTokenFromStep
- `<details>` count: 0
- `<summary>` count: 0
- UX tokens:
  - codeFlow: false
  - codeRelated: false
  - commandNextChecks: false
  - functionFlow: true
  - nextCheckAdvisor: true
  - pasteBackHint: true
  - projectAnalyzer: true

### src/pwa/command_explainer.js

- Lines: 2770
- App/version mentions: 20260619_v327_a3
- DOM ids: none
- Render functions: renderActionGuideV285, renderCommandActionGuideV285, renderCommandAnalysisV277, renderCommandDangerGuideV286, renderCommandDangerGuideV287, renderCommandExtraNotesV283, renderCommandNextChecksV277, renderCommandPasteBackHintV327A3, renderCommandSafetyChecklistV290, renderCommandSafetyGroupV292, renderCommandSampleDescriptionV289, renderCommandSampleSafetyGroupsV294, renderCommandStepsV277, renderCommandSummaryV277, renderCommandWarningsV277, renderDangerGuideV286, renderDangerGuideV287, renderExtraNotesV283, renderSafetyChecklistV290, renderSampleDescriptionV289, renderSampleSafetyGroupsV294, renderV277
- Functions: analyzeBashV278, analyzeCommandInputV277, analyzePowerShellV277, bindCommandSafetyChecklistCopyV290, buildBashControlStepV278, buildCommandActionGuideV285, buildCommandBeginnerNoteV281, buildCommandDangerGuideV286, buildCommandGitFlowNoteV282, buildCommandSafetyChecklistV290, buildCommandSampleSafetyGroupsV294, buildControlStepV277, classifyBashLineV278, classifyDangerChecklistStepV291, classifyPowerShellLineV277, clearCommandInputV277, copyTextToClipboardV290, detectCommandLanguageV277, enhanceCommandResultForBeginnersV281, enhanceCommandResultGitFlowWordingV282, enhanceCommandStepForBeginnersV281, enhanceCommandStepGitFlowWordingV282, escapeHtmlV277, extractQuotedOrPathV290, fallbackCopyTextV290, getCommandElV277, getCommandResultShellV290, getCommandSafetyGroupKeyV292, getCommandSafetyGroupMetaV292, getCommandSafetyGroupsV292, getCommandSampleV288, getDangerReasonV286, getRiskClassV277, getRiskLabelV277, initCommandExplainerV277, injectCommandExplainerStyleV277, isBashCommentV278, isBashControlLineV278, isDangerRawCommandV286, isPowerShellCommentV277, isPowerShellControlLineV277, loadCommandSampleV288, loadPowerShellSampleV277, markDone, normalizeSafetyCommandsV290, pushBackupBranchCommandsV291, pushTargetInspectionCommandsV291, refreshCommandExplainerV277, renderCommandActionGuideV285, renderCommandAnalysisV277, renderCommandDangerGuideV286, renderCommandDangerGuideV287, renderCommandExtraNotesV283, renderCommandNextChecksV277, renderCommandPasteBackHintV327A3, renderCommandSafetyChecklistV290, renderCommandSafetyGroupV292, renderCommandSampleDescriptionV289, renderCommandSampleSafetyGroupsV294, renderCommandStepsV277, renderCommandSummaryV277, renderCommandWarningsV277, syncCommandSampleShellV288, updateCommandSampleDescriptionV289
- `<details>` count: 4
- `<summary>` count: 4
- UX tokens:
  - codeFlow: false
  - codeRelated: false
  - commandNextChecks: true
  - functionFlow: false
  - nextCheckAdvisor: false
  - pasteBackHint: true
  - projectAnalyzer: true

### src/pwa/project_analyzer.js

- Lines: 2295
- App/version mentions: 20260619_v326_a3
- DOM ids: copyProjectHandoffBtn, projectHandoffOutput
- Render functions: renderCallCandidateDetails, renderCandidateBundles, renderCrossFileDetailPanelV271, renderDataSection, renderEnvironmentAudit, renderFocusFiles, renderJsonReportSections, renderKeyFiles, renderProbeAnalysis, renderProjectCodeBridgeButton, renderProjectCodeChip, renderProjectCodeHiddenItems, renderProjectCodeMoreToggle, renderProjectConnectionCandidateNoticeV305, renderProjectConnectionSummaryCardsV305, renderProjectCrossFileConfidenceBadgeV267, renderProjectCrossFileDetailPanelV271, renderProjectCrossFileEvidenceBlockV271, renderProjectCrossFileFocusSelectV269, renderProjectCrossFileGroupsV267, renderProjectCrossFileLinksV265, renderProjectCrossFileLinksV265BaseV305, renderProjectCrossFileRowV267, renderProjectMermaid, renderProjectUsageHint, renderRecommendationCards, renderReferenceDetails, renderRoleCounts, renderSymbolFiles, renderer
- Functions: add, addLink, analyzePastedOutput, annotateProjectCrossFileLinkV266, buildProbeCommand, buildProjectCodeBridgeSnippet, buildProjectCodeMoreId, buildProjectCrossFileLinksV265, buildProjectCrossFileMermaidV265, buildProjectCrossFileMermaidV305, buildProjectHandoff, buildProjectSymbolOwnerIndexV265, buildRecommendations, candidateBundleDisplayLabel, classifyProjectConnectionKindV305, clearProjectAnalyzer, collectKnownProjectFilesV323A4, copyCommand, copyProjectHandoff, decodeProjectCodeBridgePayload, el, encodeProjectCodeBridgePayload, enrichProjectCrossFileLinksWithEvidenceV271, escapeHtml, extractMermaid, filterAndRankProjectCrossFileLinksV266, filterProjectCrossFileLinksByFocusV269, findProjectCodeBridgeSnippet, firstBundle, generateCommand, getLineValue, getProjectConnectionKindLabelV305, getProjectCrossFileAvailableFilesV269, getProjectCrossFileConfidenceV266, getProjectCrossFileFocusPathV269, getProjectCrossFileGroupKeyV267, getProjectCrossFileGroupLabelV267, getProjectCrossFileSourceEvidenceV271, getProjectCrossFileTargetEvidenceV271, groupProjectCrossFileLinksV267, handleProjectCodeBridgeClick, handleProjectCodeMoreToggleClick, idFor, inferBridgeSnippetLanguage, init, isProjectGenericSymbolV266, isProjectPwaManifestFileV323A4, isProjectServiceWorkerFileV323A4, isProjectStrongSymbolV266, normalizeJsonCounts, normalizeJsonEnvironment, normalizeProjectPathV265, objectEntries, parseEnvironmentAudit, parseMarkdownCount, parseProbeOutput, parseProjectReportJson, probePythonCode, projectDetailPathPriority, quotePowerShellSingle, refresh, renderCallCandidateDetails, renderCandidateBundles, renderDataSection, renderEnvironmentAudit, renderFocusFiles, renderJsonReportSections, renderKeyFiles, renderProbeAnalysis, renderProjectCodeBridgeButton, renderProjectCodeChip, renderProjectCodeHiddenItems, renderProjectCodeMoreToggle, renderProjectConnectionCandidateNoticeV305, renderProjectConnectionSummaryCardsV305, renderProjectCrossFileConfidenceBadgeV267, renderProjectCrossFileDetailPanelV271, renderProjectCrossFileEvidenceBlockV271, renderProjectCrossFileFocusSelectV269, renderProjectCrossFileGroupsV267, renderProjectCrossFileLinksV265, renderProjectCrossFileRowV267, renderProjectMermaid, renderProjectUsageHint, renderRecommendationCards, renderReferenceDetails, renderRoleCounts, renderSymbolFiles, rerenderProjectMermaidWhenReady, resolveProjectReferenceTargetV265, setProjectCrossFileFocusPathV269, shouldKeepProjectCrossFileLinkV266, sortProjectDetailEntries, statusLabel, summarizeProjectConnectionGraphV305, switchToCodeExplainerViewV234
- `<details>` count: 2
- `<summary>` count: 2
- UX tokens:
  - codeFlow: false
  - codeRelated: false
  - commandNextChecks: false
  - functionFlow: false
  - nextCheckAdvisor: false
  - pasteBackHint: false
  - projectAnalyzer: true

### index.html

- Lines: 61
- App/version mentions: 20260619_v327_a3
- DOM ids: none
- Render functions: none
- Functions: none
- `<details>` count: 0
- `<summary>` count: 0
- UX tokens:
  - codeFlow: false
  - codeRelated: false
  - commandNextChecks: false
  - functionFlow: false
  - nextCheckAdvisor: false
  - pasteBackHint: false
  - projectAnalyzer: false

## V328 UX decision draft

### Code explanation

Default view should show:

1. Result first: what output or effect this code is trying to make.
2. Main result-making function first.
3. Function purpose cards using easy words plus real code names in parentheses.
4. Name tags: explain variables as labels, not as abstract terms.
5. One simple Mermaid flow diagram.

Default view should hide under details:

- Full numeric summary.
- Data flow details.
- Call flow details.
- Long per-line explanation.
- Related cards.
- Mermaid source.
- Internal fields such as roleSummary, orderedSteps, functionFlowV326A4, nextCheckAdvisorV326A4.

### Command explanation

Default view should show:

1. Is this safe to run?
2. What will happen?
3. What should be checked first?
4. Paste-back guidance only when more context is needed.

### Project analysis

Default view should show:

1. What kind of project this appears to be.
2. First files to open.
3. How it likely runs.
4. What is unknown and which read-only command can confirm it.

## Next step

Do not patch UI yet. Review this inventory and then write a V328 UX layout contract before implementation.
