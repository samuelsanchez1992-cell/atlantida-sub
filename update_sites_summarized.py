import re

new_descriptions = {
    'La Catedral y La Rapadura': 'Destaca por su espectacular geología volcánica. Sus enormes bóvedas, arcos y pasadizos naturales emulan un majestuoso templo gótico sumergido. Los contraluces que se filtran por las grietas de la cueva ofrecen estampas fotográficas inigualables.',
    'Baja del Realejo': 'Pico rocoso basáltico que sube desde los -60m hasta los -9m, rodeado de pasillos y cuevas.<br><br>Con buenas condiciones de mar, ofrece aguas cristalinas y un paisaje increíble. Sirve de refugio a gran variedad de fauna, permitiendo nadar entre peces pequeños, morenas, abades, meros y bicudas.',
    'Tubo de Garachico': '<strong>El Tubo de Garachico</strong><br>Una de las cuevas más profundas del archipiélago. Es un estrecho túnel volcánico de más de 150m sin ramificaciones, haciéndolo seguro para el buceo. Su interior es un espectáculo donde nadar junto a pequeños invertebrados, fulas, catalufas, chuchos negros y cigalas canarias.',
    'Acantilado de Los Gigantes': '<strong>Inmersión La Atlántida</strong><br>Singular inmersión entre 18 y 30 metros frente a Los Gigantes. Destaca por sus columnas basálticas hexagonales que asemejan una ciudad sumergida ancestral. Sus aguas claras albergan abundante vida marina: abades, meros, morenas, bancos de roncadores e incluso rayas o tiburones ángel.',
    'Cueva de los Cerebros': '<strong>Cueva de tubos volcánicos (ZEC)</strong><br>Una de las cuevas más grandes y seguras del archipiélago. Su nombre proviene de unas singulares esponjas en forma de cerebro (especie amenazada). Es un ecosistema único para la fauna de penumbra: anémonas, cigalas, chuchos negros y langostas canarias.',
    'El Balito': 'Sitio con espectaculares formaciones rocosas, túneles y cuevas con tragaluces. En sus rutas es posible avistar anémonas gigantes, langostas y diversos tipos de rayas, brindando la mágica sensación de bucear en otro planeta.',
    'El Bufadero': '<strong>Para todos los niveles (8-25m)</strong><br>Descenso controlado en tres niveles. Evitando la cueva por seguridad, podrás nadar entre peces trompeta, tortugas verdes y rocas llenas de anémonas o pulpos. En el fondo arenoso destacan anguilas jardineras, obispos, chuchos y mantelinas.',
    'Cueva de las Morenas': 'Inmersión avanzada en cueva (32m) en el Palm-Mar. Debe su nombre a las morenas mediterráneas y negras en sus grietas. Ofrece efectos de luz en su cámara principal, paredes de esponjas y crustáceos. En el exterior habitan meros, barracudas y tortugas.',
    'Pecio El Condesito': '<strong>Pecio a 20m de profundidad</strong><br>‘El Condesito’ encalló en 1971 y hoy reposa fragmentado en un cañón rodeado de espectaculares rocas prismáticas. Alberga pulpos, chocos y viejas. Por su escasa profundidad y visibilidad, es accesible e ideal para nivel medio o snorkel.',
    'Faro de Punta Rasca': '<strong>Órganos submarinos</strong><br>Inmersión frente al faro de Rasca con barrancos de lava enfriada en forma de peldaños prismáticos. El recorrido desciende 20m entre arcos y túneles, destacando por inmensos bancos de roncadores y bicudas. Enclave excelente para fotógrafos con anémonas, verrugatos y angelotes.',
    'Bahía de Abades': '<strong>Paraíso de aguas cristalinas</strong><br>Punto ideal para snorkel y buceo de todos los niveles. Con visibilidad de más de 20 metros, Abades ofrece formaciones volcánicas y gran diversidad: tortugas, rayas, sepias, pulpos y peces trompeta. Destaca por su fácil acceso desde la playa.',
    'Las Eras': '<strong>Inmersión fotogénica y llena de vida</strong><br>Destaca por su pared volcánica (9 a 18m), estrechos pasadizos con contraluces e incluso estatuas sumergidas. Sus rocas albergan multitud de especies: chuchos negros, morenas, pulpos, barracudas, rayas y peces trompeta.',
    'Punta Prieta': 'Impresionante relieve volcánico que promedia los 20m (38m máximo). Es el hábitat de fauna muy destacada como caballitos de mar, meros, rayas, angelotes, bancos de roncadores y la peculiar morena picopato.',
    'Boca Cangrejo': 'Inmersión de orilla para principiantes (18m). Su caleta protegida da fácil acceso a arrecifes con pequeñas cuevas y arenales. Abundan peces trompeta, sepias, lábridos, nudibranquios, pequeñas morenas y cangrejos.',
    'Añaza': 'Inmersión de costa para todos los niveles con cómoda entrada por rampa. Ideal para explorar sus hermosos arrecifes volcánicos, fondos arenosos y un veril profundo rebosante de vida marina.'
}

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

for site_name, new_desc in new_descriptions.items():
    escaped_site = re.escape(site_name)
    # Match: .bindPopup(px('Name', 'depth', 'level', 'type', ...
    # And everything until the final ));
    pattern = r"(\.bindPopup\(px\('" + escaped_site + r"',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*)[\s\S]*?(\s*\)\);)"
    
    safe_desc = new_desc.replace("'", "\\'")
    
    def repl(m):
        return m.group(1) + "'" + safe_desc + "'" + m.group(2)
        
    content = re.sub(pattern, repl, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Descriptions updated successfully.')
