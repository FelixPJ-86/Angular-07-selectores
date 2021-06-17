import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from "rxjs/operators";

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario:FormGroup = this.fb.group({
    region: ['',Validators.required],
    pais: ['',Validators.required],
    frontera: ['',Validators.required]

  });


  regiones :string[]=[];
  paises   :PaisSmall[]=[];
  // fronteras: string[]=[];
   fronteras: PaisSmall[]=[];
  cargando:boolean=false;

  constructor(private fb:FormBuilder,
              private paisesService:PaisesService) { }

  ngOnInit(): void {
      this.regiones=this.paisesService.regiones;

    // //cuando cambie la region
    // this.miFormulario.get('region')?.valueChanges
    // .subscribe(region => {
    //   console.log(region);

    //   this.paisesService.getPaisesPorRegion(region)
    //   .subscribe(paises => {
    //       this.paises =paises;
    //       console.log(paises);
    //   });
    // });

    //cuando cambie la region
      this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap( _ =>{
            this.miFormulario.get('pais')?.reset('');
            this.cargando=true;
          }),
          switchMap( region => this.paisesService.getPaisesPorRegion(region) )
        )
        .subscribe( paises => {
          this.paises =paises;
          this.cargando=false;
        });


    //cuando cambia  el país
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap(_=>{
        this.fronteras=[];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando=true;
      }
      ),
      switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo)),
      switchMap( pais=> this.paisesService.getPaisesPorCodigos(pais?.borders!))
    )
    .subscribe( paises => {
       this.fronteras = paises;
      this.cargando=false;
    });


  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
