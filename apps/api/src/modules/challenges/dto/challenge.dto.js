"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishChallengeDto = exports.ChallengeQueryDto = exports.UpdateChallengeDto = exports.CreateChallengeDto = exports.EvaluationCriterionDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
var platform_enum_1 = require("../../../common/enums/platform.enum");
var EvaluationCriterionDto = function () {
    var _a;
    var _criterion_decorators;
    var _criterion_initializers = [];
    var _criterion_extraInitializers = [];
    var _weight_decorators;
    var _weight_initializers = [];
    var _weight_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    return _a = /** @class */ (function () {
            function EvaluationCriterionDto() {
                this.criterion = __runInitializers(this, _criterion_initializers, void 0);
                this.weight = (__runInitializers(this, _criterion_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
                this.description = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
            return EvaluationCriterionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _criterion_decorators = [(0, swagger_1.ApiProperty)({ example: 'Technical Capability' }), (0, class_validator_1.IsString)()];
            _weight_decorators = [(0, swagger_1.ApiProperty)({ example: 0.3, description: 'Weight between 0 and 1' }), (0, class_validator_1.IsNumber)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Assess depth of technical solution' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _criterion_decorators, { kind: "field", name: "criterion", static: false, private: false, access: { has: function (obj) { return "criterion" in obj; }, get: function (obj) { return obj.criterion; }, set: function (obj, value) { obj.criterion = value; } }, metadata: _metadata }, _criterion_initializers, _criterion_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: function (obj) { return "weight" in obj; }, get: function (obj) { return obj.weight; }, set: function (obj, value) { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.EvaluationCriterionDto = EvaluationCriterionDto;
var CreateChallengeDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _problemStatement_decorators;
    var _problemStatement_initializers = [];
    var _problemStatement_extraInitializers = [];
    var _desiredOutcome_decorators;
    var _desiredOutcome_initializers = [];
    var _desiredOutcome_extraInitializers = [];
    var _existingApproach_decorators;
    var _existingApproach_initializers = [];
    var _existingApproach_extraInitializers = [];
    var _sector_decorators;
    var _sector_initializers = [];
    var _sector_extraInitializers = [];
    var _domain_decorators;
    var _domain_initializers = [];
    var _domain_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _targetBeneficiaries_decorators;
    var _targetBeneficiaries_initializers = [];
    var _targetBeneficiaries_extraInitializers = [];
    var _technicalRequirements_decorators;
    var _technicalRequirements_initializers = [];
    var _technicalRequirements_extraInitializers = [];
    var _functionalRequirements_decorators;
    var _functionalRequirements_initializers = [];
    var _functionalRequirements_extraInitializers = [];
    var _constraints_decorators;
    var _constraints_initializers = [];
    var _constraints_extraInitializers = [];
    var _eligibilityCriteria_decorators;
    var _eligibilityCriteria_initializers = [];
    var _eligibilityCriteria_extraInitializers = [];
    var _budgetMinLakh_decorators;
    var _budgetMinLakh_initializers = [];
    var _budgetMinLakh_extraInitializers = [];
    var _budgetMaxLakh_decorators;
    var _budgetMaxLakh_initializers = [];
    var _budgetMaxLakh_extraInitializers = [];
    var _pilotDurationDays_decorators;
    var _pilotDurationDays_initializers = [];
    var _pilotDurationDays_extraInitializers = [];
    var _submissionDeadline_decorators;
    var _submissionDeadline_initializers = [];
    var _submissionDeadline_extraInitializers = [];
    var _evaluationCriteria_decorators;
    var _evaluationCriteria_initializers = [];
    var _evaluationCriteria_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateChallengeDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.problemStatement = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _problemStatement_initializers, void 0));
                this.desiredOutcome = (__runInitializers(this, _problemStatement_extraInitializers), __runInitializers(this, _desiredOutcome_initializers, void 0));
                this.existingApproach = (__runInitializers(this, _desiredOutcome_extraInitializers), __runInitializers(this, _existingApproach_initializers, void 0));
                this.sector = (__runInitializers(this, _existingApproach_extraInitializers), __runInitializers(this, _sector_initializers, void 0));
                this.domain = (__runInitializers(this, _sector_extraInitializers), __runInitializers(this, _domain_initializers, void 0));
                this.location = (__runInitializers(this, _domain_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.state = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.targetBeneficiaries = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _targetBeneficiaries_initializers, void 0));
                this.technicalRequirements = (__runInitializers(this, _targetBeneficiaries_extraInitializers), __runInitializers(this, _technicalRequirements_initializers, void 0));
                this.functionalRequirements = (__runInitializers(this, _technicalRequirements_extraInitializers), __runInitializers(this, _functionalRequirements_initializers, void 0));
                this.constraints = (__runInitializers(this, _functionalRequirements_extraInitializers), __runInitializers(this, _constraints_initializers, void 0));
                this.eligibilityCriteria = (__runInitializers(this, _constraints_extraInitializers), __runInitializers(this, _eligibilityCriteria_initializers, void 0));
                this.budgetMinLakh = (__runInitializers(this, _eligibilityCriteria_extraInitializers), __runInitializers(this, _budgetMinLakh_initializers, void 0));
                this.budgetMaxLakh = (__runInitializers(this, _budgetMinLakh_extraInitializers), __runInitializers(this, _budgetMaxLakh_initializers, void 0));
                this.pilotDurationDays = (__runInitializers(this, _budgetMaxLakh_extraInitializers), __runInitializers(this, _pilotDurationDays_initializers, void 0));
                this.submissionDeadline = (__runInitializers(this, _pilotDurationDays_extraInitializers), __runInitializers(this, _submissionDeadline_initializers, void 0));
                this.evaluationCriteria = (__runInitializers(this, _submissionDeadline_extraInitializers), __runInitializers(this, _evaluationCriteria_initializers, void 0));
                __runInitializers(this, _evaluationCriteria_extraInitializers);
            }
            return CreateChallengeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'Real-time Water Leakage Detection System' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ example: 'Municipal water pipelines lose approximately 30% of supply...' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _problemStatement_decorators = [(0, swagger_1.ApiProperty)({ example: 'High water loss and operational costs due to undetected leaks.' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _desiredOutcome_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Reduce pipeline water loss by 50% within 12 months.' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _existingApproach_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Manual inspection once every 3 months.' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _sector_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Water Management' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(100)];
            _domain_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'IoT' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(100)];
            _location_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Bengaluru' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(255)];
            _state_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Karnataka' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(100)];
            _targetBeneficiaries_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Municipal corporations and city residents.' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _technicalRequirements_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'IoT sensors, real-time analytics, mobile alerts.' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _functionalRequirements_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Leak detection, alert generation, reporting dashboard.' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _constraints_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Must work with existing SCADA infrastructure.' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _eligibilityCriteria_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Company registered in India, at least 2 years old.' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _budgetMinLakh_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 10, description: 'Minimum budget in lakhs INR' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0)];
            _budgetMaxLakh_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 50, description: 'Maximum budget in lakhs INR' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0)];
            _pilotDurationDays_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 90, description: 'Pilot duration in days' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(1)];
            _submissionDeadline_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2026-10-31T23:59:59Z' }), (0, class_validator_1.IsDateString)(), (0, class_validator_1.IsOptional)()];
            _evaluationCriteria_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    type: [EvaluationCriterionDto],
                    description: 'Evaluation criteria with weights',
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return EvaluationCriterionDto; })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _problemStatement_decorators, { kind: "field", name: "problemStatement", static: false, private: false, access: { has: function (obj) { return "problemStatement" in obj; }, get: function (obj) { return obj.problemStatement; }, set: function (obj, value) { obj.problemStatement = value; } }, metadata: _metadata }, _problemStatement_initializers, _problemStatement_extraInitializers);
            __esDecorate(null, null, _desiredOutcome_decorators, { kind: "field", name: "desiredOutcome", static: false, private: false, access: { has: function (obj) { return "desiredOutcome" in obj; }, get: function (obj) { return obj.desiredOutcome; }, set: function (obj, value) { obj.desiredOutcome = value; } }, metadata: _metadata }, _desiredOutcome_initializers, _desiredOutcome_extraInitializers);
            __esDecorate(null, null, _existingApproach_decorators, { kind: "field", name: "existingApproach", static: false, private: false, access: { has: function (obj) { return "existingApproach" in obj; }, get: function (obj) { return obj.existingApproach; }, set: function (obj, value) { obj.existingApproach = value; } }, metadata: _metadata }, _existingApproach_initializers, _existingApproach_extraInitializers);
            __esDecorate(null, null, _sector_decorators, { kind: "field", name: "sector", static: false, private: false, access: { has: function (obj) { return "sector" in obj; }, get: function (obj) { return obj.sector; }, set: function (obj, value) { obj.sector = value; } }, metadata: _metadata }, _sector_initializers, _sector_extraInitializers);
            __esDecorate(null, null, _domain_decorators, { kind: "field", name: "domain", static: false, private: false, access: { has: function (obj) { return "domain" in obj; }, get: function (obj) { return obj.domain; }, set: function (obj, value) { obj.domain = value; } }, metadata: _metadata }, _domain_initializers, _domain_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _targetBeneficiaries_decorators, { kind: "field", name: "targetBeneficiaries", static: false, private: false, access: { has: function (obj) { return "targetBeneficiaries" in obj; }, get: function (obj) { return obj.targetBeneficiaries; }, set: function (obj, value) { obj.targetBeneficiaries = value; } }, metadata: _metadata }, _targetBeneficiaries_initializers, _targetBeneficiaries_extraInitializers);
            __esDecorate(null, null, _technicalRequirements_decorators, { kind: "field", name: "technicalRequirements", static: false, private: false, access: { has: function (obj) { return "technicalRequirements" in obj; }, get: function (obj) { return obj.technicalRequirements; }, set: function (obj, value) { obj.technicalRequirements = value; } }, metadata: _metadata }, _technicalRequirements_initializers, _technicalRequirements_extraInitializers);
            __esDecorate(null, null, _functionalRequirements_decorators, { kind: "field", name: "functionalRequirements", static: false, private: false, access: { has: function (obj) { return "functionalRequirements" in obj; }, get: function (obj) { return obj.functionalRequirements; }, set: function (obj, value) { obj.functionalRequirements = value; } }, metadata: _metadata }, _functionalRequirements_initializers, _functionalRequirements_extraInitializers);
            __esDecorate(null, null, _constraints_decorators, { kind: "field", name: "constraints", static: false, private: false, access: { has: function (obj) { return "constraints" in obj; }, get: function (obj) { return obj.constraints; }, set: function (obj, value) { obj.constraints = value; } }, metadata: _metadata }, _constraints_initializers, _constraints_extraInitializers);
            __esDecorate(null, null, _eligibilityCriteria_decorators, { kind: "field", name: "eligibilityCriteria", static: false, private: false, access: { has: function (obj) { return "eligibilityCriteria" in obj; }, get: function (obj) { return obj.eligibilityCriteria; }, set: function (obj, value) { obj.eligibilityCriteria = value; } }, metadata: _metadata }, _eligibilityCriteria_initializers, _eligibilityCriteria_extraInitializers);
            __esDecorate(null, null, _budgetMinLakh_decorators, { kind: "field", name: "budgetMinLakh", static: false, private: false, access: { has: function (obj) { return "budgetMinLakh" in obj; }, get: function (obj) { return obj.budgetMinLakh; }, set: function (obj, value) { obj.budgetMinLakh = value; } }, metadata: _metadata }, _budgetMinLakh_initializers, _budgetMinLakh_extraInitializers);
            __esDecorate(null, null, _budgetMaxLakh_decorators, { kind: "field", name: "budgetMaxLakh", static: false, private: false, access: { has: function (obj) { return "budgetMaxLakh" in obj; }, get: function (obj) { return obj.budgetMaxLakh; }, set: function (obj, value) { obj.budgetMaxLakh = value; } }, metadata: _metadata }, _budgetMaxLakh_initializers, _budgetMaxLakh_extraInitializers);
            __esDecorate(null, null, _pilotDurationDays_decorators, { kind: "field", name: "pilotDurationDays", static: false, private: false, access: { has: function (obj) { return "pilotDurationDays" in obj; }, get: function (obj) { return obj.pilotDurationDays; }, set: function (obj, value) { obj.pilotDurationDays = value; } }, metadata: _metadata }, _pilotDurationDays_initializers, _pilotDurationDays_extraInitializers);
            __esDecorate(null, null, _submissionDeadline_decorators, { kind: "field", name: "submissionDeadline", static: false, private: false, access: { has: function (obj) { return "submissionDeadline" in obj; }, get: function (obj) { return obj.submissionDeadline; }, set: function (obj, value) { obj.submissionDeadline = value; } }, metadata: _metadata }, _submissionDeadline_initializers, _submissionDeadline_extraInitializers);
            __esDecorate(null, null, _evaluationCriteria_decorators, { kind: "field", name: "evaluationCriteria", static: false, private: false, access: { has: function (obj) { return "evaluationCriteria" in obj; }, get: function (obj) { return obj.evaluationCriteria; }, set: function (obj, value) { obj.evaluationCriteria = value; } }, metadata: _metadata }, _evaluationCriteria_initializers, _evaluationCriteria_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateChallengeDto = CreateChallengeDto;
var UpdateChallengeDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _problemStatement_decorators;
    var _problemStatement_initializers = [];
    var _problemStatement_extraInitializers = [];
    var _desiredOutcome_decorators;
    var _desiredOutcome_initializers = [];
    var _desiredOutcome_extraInitializers = [];
    var _sector_decorators;
    var _sector_initializers = [];
    var _sector_extraInitializers = [];
    var _domain_decorators;
    var _domain_initializers = [];
    var _domain_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _technicalRequirements_decorators;
    var _technicalRequirements_initializers = [];
    var _technicalRequirements_extraInitializers = [];
    var _eligibilityCriteria_decorators;
    var _eligibilityCriteria_initializers = [];
    var _eligibilityCriteria_extraInitializers = [];
    var _budgetMinLakh_decorators;
    var _budgetMinLakh_initializers = [];
    var _budgetMinLakh_extraInitializers = [];
    var _budgetMaxLakh_decorators;
    var _budgetMaxLakh_initializers = [];
    var _budgetMaxLakh_extraInitializers = [];
    var _pilotDurationDays_decorators;
    var _pilotDurationDays_initializers = [];
    var _pilotDurationDays_extraInitializers = [];
    var _submissionDeadline_decorators;
    var _submissionDeadline_initializers = [];
    var _submissionDeadline_extraInitializers = [];
    var _evaluationCriteria_decorators;
    var _evaluationCriteria_initializers = [];
    var _evaluationCriteria_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateChallengeDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.problemStatement = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _problemStatement_initializers, void 0));
                this.desiredOutcome = (__runInitializers(this, _problemStatement_extraInitializers), __runInitializers(this, _desiredOutcome_initializers, void 0));
                this.sector = (__runInitializers(this, _desiredOutcome_extraInitializers), __runInitializers(this, _sector_initializers, void 0));
                this.domain = (__runInitializers(this, _sector_extraInitializers), __runInitializers(this, _domain_initializers, void 0));
                this.location = (__runInitializers(this, _domain_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.technicalRequirements = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _technicalRequirements_initializers, void 0));
                this.eligibilityCriteria = (__runInitializers(this, _technicalRequirements_extraInitializers), __runInitializers(this, _eligibilityCriteria_initializers, void 0));
                this.budgetMinLakh = (__runInitializers(this, _eligibilityCriteria_extraInitializers), __runInitializers(this, _budgetMinLakh_initializers, void 0));
                this.budgetMaxLakh = (__runInitializers(this, _budgetMinLakh_extraInitializers), __runInitializers(this, _budgetMaxLakh_initializers, void 0));
                this.pilotDurationDays = (__runInitializers(this, _budgetMaxLakh_extraInitializers), __runInitializers(this, _pilotDurationDays_initializers, void 0));
                this.submissionDeadline = (__runInitializers(this, _pilotDurationDays_extraInitializers), __runInitializers(this, _submissionDeadline_initializers, void 0));
                this.evaluationCriteria = (__runInitializers(this, _submissionDeadline_extraInitializers), __runInitializers(this, _evaluationCriteria_initializers, void 0));
                __runInitializers(this, _evaluationCriteria_extraInitializers);
            }
            return UpdateChallengeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(500)];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _problemStatement_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _desiredOutcome_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _sector_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _domain_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _location_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _technicalRequirements_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _eligibilityCriteria_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _budgetMinLakh_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _budgetMaxLakh_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _pilotDurationDays_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _submissionDeadline_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsDateString)(), (0, class_validator_1.IsOptional)()];
            _evaluationCriteria_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [EvaluationCriterionDto] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return EvaluationCriterionDto; })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _problemStatement_decorators, { kind: "field", name: "problemStatement", static: false, private: false, access: { has: function (obj) { return "problemStatement" in obj; }, get: function (obj) { return obj.problemStatement; }, set: function (obj, value) { obj.problemStatement = value; } }, metadata: _metadata }, _problemStatement_initializers, _problemStatement_extraInitializers);
            __esDecorate(null, null, _desiredOutcome_decorators, { kind: "field", name: "desiredOutcome", static: false, private: false, access: { has: function (obj) { return "desiredOutcome" in obj; }, get: function (obj) { return obj.desiredOutcome; }, set: function (obj, value) { obj.desiredOutcome = value; } }, metadata: _metadata }, _desiredOutcome_initializers, _desiredOutcome_extraInitializers);
            __esDecorate(null, null, _sector_decorators, { kind: "field", name: "sector", static: false, private: false, access: { has: function (obj) { return "sector" in obj; }, get: function (obj) { return obj.sector; }, set: function (obj, value) { obj.sector = value; } }, metadata: _metadata }, _sector_initializers, _sector_extraInitializers);
            __esDecorate(null, null, _domain_decorators, { kind: "field", name: "domain", static: false, private: false, access: { has: function (obj) { return "domain" in obj; }, get: function (obj) { return obj.domain; }, set: function (obj, value) { obj.domain = value; } }, metadata: _metadata }, _domain_initializers, _domain_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _technicalRequirements_decorators, { kind: "field", name: "technicalRequirements", static: false, private: false, access: { has: function (obj) { return "technicalRequirements" in obj; }, get: function (obj) { return obj.technicalRequirements; }, set: function (obj, value) { obj.technicalRequirements = value; } }, metadata: _metadata }, _technicalRequirements_initializers, _technicalRequirements_extraInitializers);
            __esDecorate(null, null, _eligibilityCriteria_decorators, { kind: "field", name: "eligibilityCriteria", static: false, private: false, access: { has: function (obj) { return "eligibilityCriteria" in obj; }, get: function (obj) { return obj.eligibilityCriteria; }, set: function (obj, value) { obj.eligibilityCriteria = value; } }, metadata: _metadata }, _eligibilityCriteria_initializers, _eligibilityCriteria_extraInitializers);
            __esDecorate(null, null, _budgetMinLakh_decorators, { kind: "field", name: "budgetMinLakh", static: false, private: false, access: { has: function (obj) { return "budgetMinLakh" in obj; }, get: function (obj) { return obj.budgetMinLakh; }, set: function (obj, value) { obj.budgetMinLakh = value; } }, metadata: _metadata }, _budgetMinLakh_initializers, _budgetMinLakh_extraInitializers);
            __esDecorate(null, null, _budgetMaxLakh_decorators, { kind: "field", name: "budgetMaxLakh", static: false, private: false, access: { has: function (obj) { return "budgetMaxLakh" in obj; }, get: function (obj) { return obj.budgetMaxLakh; }, set: function (obj, value) { obj.budgetMaxLakh = value; } }, metadata: _metadata }, _budgetMaxLakh_initializers, _budgetMaxLakh_extraInitializers);
            __esDecorate(null, null, _pilotDurationDays_decorators, { kind: "field", name: "pilotDurationDays", static: false, private: false, access: { has: function (obj) { return "pilotDurationDays" in obj; }, get: function (obj) { return obj.pilotDurationDays; }, set: function (obj, value) { obj.pilotDurationDays = value; } }, metadata: _metadata }, _pilotDurationDays_initializers, _pilotDurationDays_extraInitializers);
            __esDecorate(null, null, _submissionDeadline_decorators, { kind: "field", name: "submissionDeadline", static: false, private: false, access: { has: function (obj) { return "submissionDeadline" in obj; }, get: function (obj) { return obj.submissionDeadline; }, set: function (obj, value) { obj.submissionDeadline = value; } }, metadata: _metadata }, _submissionDeadline_initializers, _submissionDeadline_extraInitializers);
            __esDecorate(null, null, _evaluationCriteria_decorators, { kind: "field", name: "evaluationCriteria", static: false, private: false, access: { has: function (obj) { return "evaluationCriteria" in obj; }, get: function (obj) { return obj.evaluationCriteria; }, set: function (obj, value) { obj.evaluationCriteria = value; } }, metadata: _metadata }, _evaluationCriteria_initializers, _evaluationCriteria_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateChallengeDto = UpdateChallengeDto;
var ChallengeQueryDto = function () {
    var _a;
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _sector_decorators;
    var _sector_initializers = [];
    var _sector_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _organizationId_decorators;
    var _organizationId_initializers = [];
    var _organizationId_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ChallengeQueryDto() {
                this.search = __runInitializers(this, _search_initializers, void 0);
                this.status = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.sector = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _sector_initializers, void 0));
                this.state = (__runInitializers(this, _sector_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.organizationId = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                this.page = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _page_initializers, void 0));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                __runInitializers(this, _limit_extraInitializers);
            }
            return ChallengeQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Full-text search on title and description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: platform_enum_1.ChallengeStatus }), (0, class_validator_1.IsEnum)(platform_enum_1.ChallengeStatus), (0, class_validator_1.IsOptional)()];
            _sector_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Water Management' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _state_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Karnataka' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _organizationId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by creating organization' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: '1' }), (0, class_validator_1.IsOptional)()];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Items per page (max 50)', default: '20' }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _sector_decorators, { kind: "field", name: "sector", static: false, private: false, access: { has: function (obj) { return "sector" in obj; }, get: function (obj) { return obj.sector; }, set: function (obj, value) { obj.sector = value; } }, metadata: _metadata }, _sector_initializers, _sector_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: function (obj) { return "organizationId" in obj; }, get: function (obj) { return obj.organizationId; }, set: function (obj, value) { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ChallengeQueryDto = ChallengeQueryDto;
var PublishChallengeDto = function () {
    var _a;
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PublishChallengeDto() {
                this.notes = __runInitializers(this, _notes_initializers, void 0);
                __runInitializers(this, _notes_extraInitializers);
            }
            return PublishChallengeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Optional internal notes before publishing' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PublishChallengeDto = PublishChallengeDto;
