import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, User, Profile } from '../../core/services/api.service';

@Component({
  selector: 'app-candidate-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-wizard.component.html',
  styleUrl: './candidate-wizard.component.css'
})
export class CandidateWizardComponent {
  private readonly apiService = inject(ApiService);

  // Wizard States
  protected readonly step = signal<number>(1);
  protected readonly isSubmitting = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);

  // Step 1 Models
  protected readonly userModel = {
    name: '',
    email: '',
    phone: ''
  };

  // Step 2 Models
  protected readonly registeredUser = signal<User | null>(null);
  protected readonly profiles = signal<Profile[]>([]);
  protected readonly profileModel = {
    profession: '',
    skills: [] as string[]
  };
  protected currentSkillInput = '';

  addSkillTag() {
    const skill = this.currentSkillInput.trim();
    if (skill && !this.profileModel.skills.includes(skill)) {
      this.profileModel.skills.push(skill);
    }
    this.currentSkillInput = '';
  }

  removeSkillTag(skillToRemove: string) {
    this.profileModel.skills = this.profileModel.skills.filter(
      skill => skill !== skillToRemove
    );
  }

  handleCreateUser() {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.apiService.createUser(this.userModel).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success && response.data) {
          this.registeredUser.set(response.data);
          this.step.set(2);
          this.loadUserProfiles(response.data.id);
        } else {
          this.errorMessage.set(response.error || 'No se pudo crear el candidato.');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          err.error?.error || 'Error al conectar con el servidor. Verifica que el backend esté activo.'
        );
      }
    });
  }

  handleCreateProfile() {
    const user = this.registeredUser();
    if (!user) {
      this.errorMessage.set('No hay un candidato activo.');
      return;
    }

    if (!this.profileModel.profession) {
      this.errorMessage.set('La profesión es requerida.');
      return;
    }

    if (this.profileModel.skills.length === 0) {
      this.errorMessage.set('Agrega al menos una habilidad.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload = {
      userId: user.id,
      profession: this.profileModel.profession,
      skills: this.profileModel.skills
    };

    this.apiService.createProfile(payload).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success && response.data) {
          this.profileModel.profession = '';
          this.profileModel.skills = [];
          this.currentSkillInput = '';
          this.loadUserProfiles(user.id);
        } else {
          this.errorMessage.set(response.error || 'No se pudo crear el perfil.');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          err.error?.error || 'Error al guardar el perfil.'
        );
      }
    });
  }

  loadUserProfiles(userId: string) {
    this.apiService.getUserProfiles(userId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.profiles.set(response.data);
        }
      },
      error: (err) => {
        console.error('Error loading profiles:', err);
      }
    });
  }

  finalizeRegistration() {
    this.step.set(3);
  }

  resetWizard() {
    this.step.set(1);
    this.userModel.name = '';
    this.userModel.email = '';
    this.userModel.phone = '';
    this.registeredUser.set(null);
    this.profiles.set([]);
    this.profileModel.profession = '';
    this.profileModel.skills = [];
    this.currentSkillInput = '';
    this.errorMessage.set(null);
  }
}
