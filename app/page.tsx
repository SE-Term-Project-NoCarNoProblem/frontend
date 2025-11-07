import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
// import CancelOverTime from "./components/CancleOverTime";
// import RatingOverTime from "./components/RatingOverTime";
export default function Home() {
	return (
		<main className="min-h-dvh bg-white">
			<div className="">
				<NavBar />
				<Hero />
				<Features />
				<Footer />
				{/* <CancelOverTime /> */}
				{/* <RatingOverTime /> */}
			</div>
		</main>
	);
}