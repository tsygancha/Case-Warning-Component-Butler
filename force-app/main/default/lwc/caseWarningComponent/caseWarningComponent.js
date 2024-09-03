import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from "lightning/uiRecordApi";

const ACCOUNT_FIELDS = ['Account.Number_of_Cases_Monthly_Allowed__c'];
const CASE_FIELDS = ['Case.AccountId'];
const BASE_FIELDS = ['Account.Id', 'Case.Id'];

export default class CaseWarningComponent extends LightningElement {
    @api recordId;
    @track recordType;
    @track feedback = '';
    @track feedbackColor = '';
    @track feedbackTextColor = '';
    @track statusIcon = '';
    @track renderFlow = true;
    flowName = 'Case_Warning';


    @wire(getRecord, { recordId: '$recordId', fields: BASE_FIELDS })
    initialFetch({ error, data }) {
        if (data) {

            if (data.apiName === 'Account') {
                this.recordType = 'Account';
            } else if (data.apiName === 'Case') {
                this.recordType = 'Case';
            }
            this.renderFlow = false;
            setTimeout(() => {
                this.renderFlow = true;
            }, 0);
        } else if (error) {
            console.error('Error retrieving record data', error);
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: '$fieldsToFetch' })
    wiredSpecificFields({ error, data }) {
        if (data) {
            // console.log('Fetched Specific Fields:', JSON.stringify(data, null, 2));
        } else if (error) {
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
                if (element.name === 'feedback') {
                    this.feedback = element.value;
                } else if (element.name === 'feedbackBackgroundColor') {
                    this.feedbackColor = element.value;
                } else if (element.name === 'feedbackTextColor') {
                    this.feedbackTextColor = element.value;
                } else if (element.name === 'circleColor') {
                    this.circleColor = element.value;
                } else if (element.name === 'feedbackHeaderIcon') {
                    this.statusIcon = element.value;
                }
            });
        }
    }

    get feedbackStyle() {
        return `background-color: ${this.feedbackColor}; color: ${this.feedbackTextColor};`;
    }

    get circleStyle() {
        return `background-color: ${this.circleColor};`;
    }
}