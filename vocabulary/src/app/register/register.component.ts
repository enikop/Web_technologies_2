import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { UserDTO } from '../../../models';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  private passwordPattern = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  registerForm = this.formBuilder.group({
    firstName: this.formBuilder.control('', Validators.required),
    lastName: this.formBuilder.control('', Validators.required ),
    username: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
    password: this.formBuilder.control('', [Validators.required, Validators.pattern(this.passwordPattern)]),
    passwordAgain: this.formBuilder.control('', [Validators.required])
  }, {validator: this.matches});

  errorMessage = {
    firstName: 'Required field.',
    lastName: 'Required field.',
    username: 'The username must be at least 5 characters long.',
    password: 'Must be at least 8 characters and contain a lowercase letter, an uppercase letter and a number.',
    passwordAgain: 'The two passwords must match.'
  }

  matches(form: AbstractControl){
    return form.get('password')!.value == form.get('passwordAgain')!.value ? null : {equals: true};
  }

  register(){
    if(this.registerForm.valid){
      const userInfo = this.registerForm.value;
      const user: UserDTO = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        username: userInfo.username,
        password: userInfo.password
      } as UserDTO;
      this.createUser(user);
    } else {
      this.toastr.error('Invalid data.', 'Unsuccessful sign up');
    }
  }

  createUser(user: UserDTO){
    this.userService.create(user).subscribe({
      next: (response) => {
        this.toastr.success('You can log in now.', 'Successful sign up.');
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        console.log(err);
        if(err.status == 422){
          this.toastr.error('Selected username already in use.', 'Unsuccessful sign up');
        } else{
          this.toastr.error('Server error.', 'Unsuccessful sign up');
        }
      }
    });
  }

}
