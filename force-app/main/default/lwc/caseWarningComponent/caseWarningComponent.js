import { LightningElement, api, wire} from 'lwc';
import { getRecord } from "lightning/uiRecordApi";

const ACCOUNT_FIELDS = ['Account.Number_of_Cases_Monthly_Allowed__c'];
const CASE_FIELDS = ['Case.AccountId'];
const BASE_FIELDS = ['Account.Id', 'Case.Id'];

export default class CaseWarningComponent extends LightningElement {
    @api recordId;
    recordType;
    feedback = '';
    feedbackColor = '';
    feedbackTextColor = '';
    statusIcon = '';
    renderFlow = true;
    flowName = 'Case_Warning';


    @wire(getRecord, { recordId: '$recordId', fields: BASE_FIELDS })
    initialFetch({ error, data }) {
        if (data) {
            this.recordType = data.apiName;

            this.toggleRenderFlow();
        } else if (error) {
            console.error('Error retrieving record data', error);
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: '$fieldsToFetch' })
    wiredSpecificFields({ error, data }) {
        if (error) {
            console.error('Error fetching specific fields', error);
        }
    }

    get fieldsToFetch() {
        if (this.recordType === 'Account') {
            return ACCOUNT_FIELDS;
        } else if (this.recordType === 'Case') {
            return CASE_FIELDS;
        } else {
            return [];
        }
    }

    get inputVariables() {
        return [
            {
                name: 'recordId',
                type: 'String',
                value: this.recordId
            },
            {
                name: 'recordType',
                type: 'String',
                value: this.recordType
            }
        ];
    }

    handleStatusChange(event) {
        const outputVars = event.detail.outputVariables;

        if (outputVars && outputVars.length > 0) {
            outputVars.forEach(element => {
                this.fetchElement(element);
            });
        }
    }

    fetchElement(element) {
        switch (element.name) {
            case 'feedback':
                this.feedback = element.value;
                break;
            case 'feedbackBackgroundColor':
                this.feedbackColor = element.value;
                break;
            case 'feedbackTextColor':
                this.feedbackTextColor = element.value;
                break;
            case 'circleColor':
                this.circleColor = element.value;
                break;
            case 'feedbackHeaderIcon':
                this.statusIcon = element.value;
                break;
        }
    }

    toggleRenderFlow() {
        this.renderFlow = false;
        setTimeout(() => {
            this.renderFlow = true;
        }, 0);
    }

    get feedbackStyle() {
        return `background-color: ${this.feedbackColor}; color: ${this.feedbackTextColor};`;
    }

    get circleStyle() {
        return `background-color: ${this.circleColor};`;
    }
}