import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from '../../components/hero/hero';
import { Stats } from '../../components/stats/stats';
import { Featured } from '../../components/featured/featured';
import { HowItWorks } from '../../components/how-it-works/how-it-works';
import { Features } from '../../components/features/features';
import { JoinUs } from "../../components/join-us/join-us";
import { Footer } from "../../components/footer/footer";
import { Navbar } from "../../components/navbar/navbar";

@Component({
  selector: 'app-home',
  imports: [CommonModule, Hero, Stats, Featured, HowItWorks, Features, JoinUs, Footer, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
