// src/pages/BlogArticles.tsx
import { Helmet } from 'react-helmet-async';
import PageTransition from '../components/PageTransition';
import { Link } from 'react-router-dom';

import StudioButton from '../components/StudioButton';

const ArticleLayout = ({
  title, metaDesc, h1, children
}: {
  title: string; metaDesc: string; h1: React.ReactNode; children: React.ReactNode;
}) => (
  <PageTransition scrollToTop={true}>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={metaDesc} />
    </Helmet>
    <article className="min-h-screen bg-[#F4F4F0] text-[#1A1A1A] px-4 md:px-10 pt-32 pb-24 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[clamp(40px,6vw,80px)] font-lausanne font-medium leading-[1.1] mb-12 tracking-tighter">
          {h1}
        </h1>
        <div className="text-[18px] md:text-[22px] font-lausanne leading-relaxed text-[#1A1A1A]/80 space-y-8 mb-20">
          {children}
        </div>

        {/* CTA Footer with StudioButton style */}
        <div className="pt-12 border-t border-black/10 flex flex-col items-start gap-8">
          <p className="text-[16px] md:text-[18px] font-lausanne italic opacity-60">
            Vous cherchez un expert pour votre projet ?
          </p>
          <div className="flex flex-wrap gap-x-12 gap-y-8">
            <StudioButton label="Me contacter" href="mailto:f.bouadi@gmail.com" />
            <StudioButton label="Voir mes projets" href="/" />
          </div>
        </div>
      </div>
    </article>
  </PageTransition>
);

export function BlogMarquesLuxe() {
  return (
    <ArticleLayout
      title="Motion Designer Luxe Paris & Animation 3D Marques Luxe | Fabien Bouadi"
      metaDesc="Découvrez comment un motion designer luxe Paris utilise l'animation 3d marques luxe pour sublimer l'héritage des grandes maisons."
      h1={<>Motion Designer Luxe Paris <span className="block text-[#1A1A1A]/40 text-[0.6em] mt-2">L'excellence de l'animation 3D marques luxe</span></>}
    >
      <p>
        En tant que <strong>motion designer luxe Paris</strong>, mon objectif est de transcender l'identité visuelle des grandes maisons. La capitale française, berceau de la haute couture et de la joaillerie, exige une approche créative où chaque image animée reflète un savoir-faire séculaire.
      </p>
      <p>
        L'<strong>animation 3d marques luxe</strong> offre une liberté absolue. Que ce soit pour simuler la réflexion de la lumière sur un diamant ou la texture fluide d'un parfum, cette technique permet de créer des visuels photoréalistes impossibles à obtenir autrement.
      </p>
      <p>
        Si vous cherchez à moderniser votre communication, découvrez mon approche de la <Link to="/blog/direction-artistique-video-paris" className="underline hover:text-black">direction artistique video paris</Link> ou parcourez mon <Link to="/" className="underline hover:text-black">portfolio de motion design</Link>.
      </p>
    </ArticleLayout>
  );
}

export function GuideCosmetiques() {
  return (
    <ArticleLayout
      title="Le Guide de l'Animation 3D Cosmétiques & Motion Design Beauté"
      metaDesc="Tout savoir sur l'animation 3d cosmétiques et l'impact du motion design produits beauté pour engager votre audience."
      h1={<>L'Animation 3D Cosmétiques <span className="block text-[#1A1A1A]/40 text-[0.6em] mt-2">Guide du motion design produits beauté</span></>}
    >
      <p>
        Le secteur de la beauté est en constante évolution, et l'<strong>animation 3d cosmétiques</strong> s'impose aujourd'hui comme le standard pour présenter des formulations innovantes. Cette technique permet de visualiser la texture d'une crème, la transparence d'un sérum, ou l'éclat d'un flacon avec une précision moléculaire.
      </p>
      <p>
        L'intégration d'un <strong>motion design produits beauté</strong> dans vos campagnes marketing augmente significativement l'engagement sur les réseaux sociaux. Cela permet de rendre le produit tangible et désirable avant même qu'il ne soit touché par le consommateur.
      </p>
      <p>
        Pour comprendre les différences techniques, lisez notre article sur le <Link to="/blog/motion-design-vs-animation" className="underline hover:text-black">motion design vs animation</Link>, ou découvrez comment ces techniques s'appliquent en explorant les <Link to="/" className="underline hover:text-black">projets 3D cosmétiques de mon portfolio</Link>.
      </p>
    </ArticleLayout>
  );
}

export function ArticleMoodtape() {
  return (
    <ArticleLayout
      title="Qu'est ce qu'une moodtape ? Définition & Usages"
      metaDesc="Découvrez la moodtape definition et comprenez qu'est ce qu'une moodtape pour structurer la vision créative de vos projets vidéo."
      h1={<>Qu'est ce qu'une moodtape ? <span className="block text-[#1A1A1A]/40 text-[0.6em] mt-2">Moodtape definition et processus</span></>}
    >
      <p>
        Beaucoup de clients me demandent <strong>qu'est ce qu'une moodtape</strong>. C'est un outil créatif fondamental en direction artistique. Il s'agit d'un montage vidéo rythmé, assemblant des extraits de films, d'images et de sons existants pour exprimer une intention visuelle et émotionnelle avant la production.
      </p>
      <p>
        La <strong>moodtape definition</strong> réside dans sa capacité à aligner toutes les équipes (clients, réalisateurs, créatifs) sur le même "mood" ou ton. C'est la version vidéo du moodboard classique, indispensable dans le milieu du luxe.
      </p>
      <p>
        Pour voir des exemples concrets de moodtapes, n'hésitez pas à consulter mon <Link to="/" className="underline hover:text-black">portfolio de réalisations</Link> ou à découvrir l'importance de ce processus dans la <Link to="/blog/direction-artistique-video-paris" className="underline hover:text-black">direction artistique video paris</Link>.
      </p>
    </ArticleLayout>
  );
}

export function BlogMotionVsAnimation() {
  return (
    <ArticleLayout
      title="Motion Design vs Animation : Animation 3D vs 2D | Fabien Bouadi"
      metaDesc="Comprendre les différences clés entre motion design vs animation et bien choisir entre animation 3d vs 2d pour votre projet."
      h1={<>Motion Design vs Animation <span className="block text-[#1A1A1A]/40 text-[0.6em] mt-2">Choisir : Animation 3D vs 2D</span></>}
    >
      <p>
        La frontière entre <strong>motion design vs animation</strong> peut sembler floue. Le motion design se concentre généralement sur l'animation d'éléments graphiques, de typographies et de formes (souvent pour le branding et la communication), tandis que l'animation traditionnelle s'articule autour de personnages et d'une trame narrative.
      </p>
      <p>
        Lorsqu'on parle de l'<strong>animation 3d vs 2d</strong>, le choix dépend de l'impact souhaité. La 2D offre un style illustratif et schématique, idéal pour l'explication. La 3D, quant à elle, apporte profondeur, photoréalisme et immersion — un atout indispensable pour les marques haut de gamme.
      </p>
      <p>
        Découvrez comment la 3D sublime les produits dans notre <Link to="/guide/animation-3d-cosmetiques" className="underline hover:text-black">guide sur l'animation 3d cosmétiques</Link> et explorez ces techniques dans mon <Link to="/" className="underline hover:text-black">portfolio motion design</Link>.
      </p>
    </ArticleLayout>
  );
}

export function GuideFreelance2026() {
  return (
    <ArticleLayout
      title="Guide Freelance Motion Designer 2026 | Tout ce qu'il Faut Savoir | Motion Designer Paris"
      metaDesc="Tout savoir pour devenir motion designer freelance en 2026 : marché, tarifs, compétences, IA et stratégies pour réussir à Paris."
      h1={<>Guide Freelance Motion Designer 2026 <span className="block text-[#1A1A1A]/40 text-[0.6em] mt-2">Le métier de motion designer paris en 2026</span></>}
    >
      <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
        <img src="/images/guide-freelance-2026-hero.png" alt="Motion designer working in a Parisian studio" className="w-full h-auto" />
      </div>

      <p className="text-[1.2em] font-medium text-[#1A1A1A] leading-tight italic border-l-4 border-[#00FF66] pl-6 py-2 mb-12">
        En l'espace de cinq ans, le motion design est passé du statut de discipline de niche à celui de compétence stratégique pour les marques. En 2026, les freelances qui savent se positionner vivent mieux que jamais. Les autres disparaissent dans la masse. Voici comment faire partie des premiers.
      </p>

      <h2 className="text-3xl md:text-4xl font-medium mt-16 mb-8 tracking-tight">Le Nouveau Visage d'un Métier en Mutation</h2>
      <p>
        Il y a encore dix ans, le motion designer était une figure quasi-mystérieuse, cantonnée aux génériques de films et aux publicités télévisées. Aujourd'hui, il est partout : dans les stories Instagram d'une marque de cosmétiques, dans l'onboarding d'une application fintech, dans la présentation d'un grand groupe au CAC 40, dans le générique d'un podcast vidéo.
      </p>
      <p>
        Cette omniprésence reflète une transformation profonde de la communication des entreprises, désormais entièrement tournée vers le contenu vidéo animé, court, percutant. La vidéo représente aujourd'hui plus de 82% du trafic internet mondial.
      </p>

      <div className="my-16 rounded-2xl overflow-hidden">
        <img src="/images/guide-freelance-2026-deliverables.png" alt="Motion design deliverables on a desk" className="w-full h-auto" />
      </div>

      <h2 className="text-3xl md:text-4xl font-medium mt-16 mb-8 tracking-tight">L'IA : Menace Fantasmée ou Levier Réel ?</h2>
      <p>
        L'intelligence artificielle ne remplacera pas les motion designers. Elle remplace déjà les mauvais motion designers — ceux qui produisent des animations génériques, sans parti pris créatif.
      </p>
      <p>
        En 2026, les outils comme <strong>Runway Gen-3</strong>, <strong>Sora</strong> ou <strong>Kling</strong> permettent de générer des séquences vidéo à partir d'un texte. Le motion designer de 2026 qui prospère est celui qui a intégré l'IA comme un collaborateur d'atelier, pas comme une menace existentielle.
      </p>

      <h2 className="text-3xl md:text-4xl font-medium mt-16 mb-8 tracking-tight">Les Compétences Indispensables</h2>
      <div className="bg-white/50 p-8 rounded-2xl border border-black/5 space-y-6">
        <h3 className="text-xl font-medium uppercase tracking-widest text-black/40">[La Stack Technique 2026]</h3>
        <ul className="list-disc list-inside space-y-3 font-medium">
          <li><strong>After Effects</strong> — maîtrise avancée, expressions, scripts</li>
          <li><strong>Cinema 4D ou Blender</strong> — la 3D n'est plus optionnelle</li>
          <li><strong>Premiere Pro ou DaVinci Resolve</strong> — montage et étalonnage</li>
          <li><strong>Figma</strong> — collaboration design produit</li>
          <li><strong>Outils IA</strong> — Runway, Midjourney, Pika</li>
        </ul>
      </div>

      <h2 className="text-3xl md:text-4xl font-medium mt-16 mb-8 tracking-tight">Les Tarifs en 2026</h2>
      <p>
        En France, les tarifs journaliers moyens (TJM) s'établissent généralement comme suit en 2026 :
      </p>
      <div className="overflow-x-auto my-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black/10">
              <th className="py-4 font-medium uppercase tracking-widest text-[13px] text-black/40">Profil</th>
              <th className="py-4 font-medium uppercase tracking-widest text-[13px] text-black/40 text-right">TJM indicatif</th>
            </tr>
          </thead>
          <tbody className="font-medium">
            <tr className="border-b border-black/5">
              <td className="py-4">Junior (0-2 ans)</td>
              <td className="py-4 text-right">350 – 500 €</td>
            </tr>
            <tr className="border-b border-black/5">
              <td className="py-4">Confirmé (2-5 ans)</td>
              <td className="py-4 text-right">500 – 800 €</td>
            </tr>
            <tr className="border-b border-black/5">
              <td className="py-4">Senior / Spécialisé</td>
              <td className="py-4 text-right">800 – 1 200 €</td>
            </tr>
            <tr>
              <td className="py-4">Expert / DA Motion</td>
              <td className="py-4 text-right">1 200 € et +</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-3xl md:text-4xl font-medium mt-16 mb-8 tracking-tight">Construire un Portfolio qui Convertit</h2>
      <p>
        Le portfolio généraliste est mort. En 2026, un client qui cherche un motion designer pour son secteur de la santé ne veut pas voir vos animations pour une marque de sneakers.
      </p>
      <p>
        La stratégie gagnante : <strong>choisissez une ou deux niches</strong> et devenez la référence. Luxe et cosmétique. Tech et fintech. Santé et bien-être.
      </p>
      
    </ArticleLayout>
  );
}
export function BlogDirectionArtistique() {
  return (
    <ArticleLayout
      title="Direction Artistique Vidéo Paris & Motion Design Process"
      metaDesc="Découvrez l'approche d'une direction artistique video paris et les étapes clés du motion design process pour les marques premium."
      h1={<>Direction Artistique Vidéo Paris <span className="block text-[#1A1A1A]/40 text-[0.6em] mt-2">Le motion design process décrypté</span></>}
    >
      <p>
        Une <strong>direction artistique video paris</strong> exige rigueur, avant-gardisme et un profond respect de l'ADN de la marque. À Paris, capitale mondiale du luxe, l'esthétique vidéo doit constamment innover tout en préservant l'intemporalité des grandes maisons.
      </p>
      <p>
        Le <strong>motion design process</strong> est l'épine dorsale de cette démarche. Il commence par l'élaboration d'un concept fort (souvent via une <Link to="/article/qu-est-ce-qu-une-moodtape" className="underline hover:text-black">moodtape</Link>), se poursuit avec des storyboards précis, la modélisation 3D, l'animation, le lighting, et s'achève sur un compositing minutieux.
      </p>
      <p>
        En tant que <Link to="/blog/motion-design-marques-luxe" className="underline hover:text-black">motion designer luxe paris</Link>, je maîtrise chaque étape de ce processus. Visualisez le résultat final à travers mon <Link to="/" className="underline hover:text-black">portfolio professionnel</Link>.
      </p>
    </ArticleLayout>
  );
}
