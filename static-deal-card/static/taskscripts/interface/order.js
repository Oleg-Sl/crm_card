import { TaskEstimateAppInterface } from './estimate.js';


export class TaskOrderAppInterface extends TaskEstimateAppInterface {
    setAtributInputs() {
        this.containerTask.querySelectorAll('input').forEach(input => input.disabled = true);
    }
}
