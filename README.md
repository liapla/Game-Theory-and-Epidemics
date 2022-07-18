# Game-Theory-and-Epidemics

This is a repository for the project "Game theory and epidemics" from Julia Plaumann, Sima Hashemi, Nuttakrit Onuthai, Marie Tersteegen

__Link to the website with the SEIDV model:__ https://seidv-model.web.app/home

What do the files do?

* [seidv-model](https://github.com/liapla/Game-Theory-and-Epidemics/tree/main/seidv-model): code for the SEIDV model website
* public: code for hosting the website in firebase
* [Recreation.ipynb](https://github.com/liapla/Game-Theory-and-Epidemics/blob/main/Recreation.ipynb): In this notebook we recreate some plots from the main [paper](https://www.pnas.org/doi/full/10.1073/pnas.1731324100) about the comparison of the individual decision and the group optimum for vaccination prior to a bioattack with smallpox.
* [Modification.ipynb](https://github.com/liapla/Game-Theory-and-Epidemics/blob/main/Modification.ipynb): In this notebook we use Game theory to investigate the self-interest policy for getting vaccinated against Covid-19 among different age-groups. We use the [Germany Covid data from Kaggle](https://www.kaggle.com/datasets/headsortails/covid19-tracking-germany?resource=download&select=covid_de.csv) ,IFR data from [Sorenson et al.](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)02867-1/fulltext#seccestitle140) paper and Germany population data from [Statista website](https://de.statista.com/statistik/daten/studie/1365/umfrage/bevoelkerung-deutschlands-nach-altersgruppen/).
* [Decision_on_model.ipynb](https://github.com/liapla/Game-Theory-and-Epidemics/blob/main/Decision_on_model.ipynb): In this notebook, we created an SEIDV model population, based on intial conditions and parameters which were obtained from [OWD Covid-19 data](https://github.com/liapla/Game-Theory-and-Epidemics/blob/main/owd_data_ger.csv)(external site, [click here](https://ourworldindata.org/coronavirus-source-data)). The result from model was used to simulated how people in different ages decide for getting vaccinated based on Game theory.
* [ifr_age.txt](https://github.com/liapla/Game-Theory-and-Epidemics/blob/main/ifr_age.txt): The data for the Covid_19 IFR among different age groups from the [Sorenson et al.](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)02867-1/fulltext#seccestitle140) paper.
* [covid_de.csv.zip](https://github.com/liapla/Game-Theory-and-Epidemics/blob/main/covid_de.csv.zip): Germany Covid data from [Kaggle](https://www.kaggle.com/datasets/headsortails/covid19-tracking-germany?resource=download&select=covid_de.csv). (ZIP-file needs to be extracted in order to run the "modification.ipynb" notebook)
* [presentation.pdf](https://github.com/liapla/Game-Theory-and-Epidemics/blob/main/presentation.pdf): Presentation of the project (also including a summary of the most important formulars and results and the references).
