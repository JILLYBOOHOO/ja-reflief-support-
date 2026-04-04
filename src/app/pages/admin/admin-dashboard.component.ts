import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeatherService, WeatherState } from '../../services/weather.service';
import { UpdateService, AlertUpdate } from '../../services/update.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ImpactRequestService, ImpactRequest, RequestItem } from '../../services/impact-request.service';
import { HazardService, HazardReport } from '../../services/hazard.service';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
    updateForm: FormGroup;
    editForm: FormGroup;
    currentWeather: WeatherState = 'sunny';
    updates: AlertUpdate[] = [];
    allRequests: ImpactRequest[] = [];
    hazardReports: HazardReport[] = [];
    isEditModalOpen = false;
    editingUpdate: AlertUpdate | null = null;

    constructor(
        private fb: FormBuilder,
        private weatherService: WeatherService,
        private updateService: UpdateService,
        private authService: AuthService,
        private impactRequestService: ImpactRequestService,
        private hazardService: HazardService,
        private router: Router
    ) {
        this.updateForm = this.fb.group({
            title: ['', Validators.required],
            source: ['ODPEM', Validators.required],
            content: ['', Validators.required],
            status: ['info', Validators.required]
        });

        this.editForm = this.fb.group({
            id: [''],
            title: ['', Validators.required],
            source: ['', Validators.required],
            content: ['', Validators.required],
            status: ['info', Validators.required]
        });
    }

    ngOnInit() {
        // Only allow admins
        const user = this.authService.currentUserValue;
        if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
            this.router.navigate(['/login']);
            return;
        }

        this.weatherService.weather$.subscribe(w => this.currentWeather = w);
        this.updateService.updates$.subscribe(u => this.updates = u);
        this.impactRequestService.requests$.subscribe(r => this.allRequests = r);
        this.fetchHazardReports();
    }

    fetchHazardReports() {
        this.hazardService.getAllReports().subscribe(reports => {
            this.hazardReports = reports;
        });
    }

    updateHazardStatus(id: number, status: string) {
        this.hazardService.updateStatus(id, status).subscribe(() => {
            this.fetchHazardReports();
        });
    }

    get recentUpdates() {
        return this.updates.slice(0, 5); // Show last 5
    }

    setWeather(state: string) {
        this.weatherService.setWeather(state as WeatherState);
    }

    openEditModal(update: AlertUpdate) {
        this.editingUpdate = update;
        this.editForm.patchValue({
            id: update.id,
            title: update.title,
            source: update.source,
            content: update.content,
            status: update.status
        });
        this.isEditModalOpen = true;
    }

    closeEditModal() {
        this.isEditModalOpen = false;
        this.editingUpdate = null;
    }

    onUpdateSave() {
        if (this.editForm.valid) {
            this.updateService.updateUpdate(this.editForm.value);
            this.closeEditModal();
        }
    }

    onSubmit() {
        if (this.updateForm.valid) {
            this.updateService.addUpdate(this.updateForm.value);
            this.updateForm.reset({ source: 'ODPEM', status: 'info' });
        }
    }

    deleteUpdate(id: string) {
        if (confirm('Delete this broadcast?')) {
            this.updateService.deleteUpdate(id);
            if (this.isEditModalOpen) this.closeEditModal();
        }
    }

    markAsReceived(request: ImpactRequest, item: RequestItem) {
        const updatedRequest = { ...request };
        updatedRequest.items = updatedRequest.items.map(i => {
            if (i.name === item.name) {
                return { ...i, status: 'received' as const };
            }
            return i;
        });
        this.impactRequestService.updateRequest(updatedRequest);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
