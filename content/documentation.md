---
title: Documentation
subtitle: Here is where documentation will go.
---


# Definitions

Below are common terms used in this study that may be unfamiliar:

- _Area Health Education Center (AHEC) Regions_: North Carolina&#39;s Area Health Education Center Program is a statewide program to develop the state&#39;s healthcare workforce, and is administered through nine regions made up of adjacent counties. Each region has its own AHEC center that is run relatively independently, to meet the unique workforce needs of the region.
- _Current workforce_. This is the headcount of the RN and LPN workforce currently in active practice in North Carolina in 2018.
- _Diffusion:_ We modeled the geographic migration of new entrants from their place of education to their first job and the movement of actively practicing nurses by concatenating multiple years of licensure data. The model also accounted for changes in employment settings of the nurse workforce.
- _In-state Training pipeline:_ We modeled the pipeline of North Carolina-educated students who enter licensure after completing their initial nursing education. The nursing workforce pipeline took into account, although did not explicitly model, graduates who do not enter the nursing workforce in North Carolina because they don&#39;t pass the NCLEX, don&#39;t practice nursing or because they leave North Carolina. Licensure data was also used to model the employment settings and geographic locations of new nurse entrants to the workforce.
- _Medicaid Region:_ North Carolina is in the process of transitioning to a managed care model for its Medicaid program. To administer the program, the NC Department of Health and Human Services has divided the state in five regions, with targeted roll-out of Managed Care happening in stages by region. Forecasting demand at this level is useful in particular when looking at the demand of the Medicaid beneficiary population.
- _Microsimulation:_ This approach allows for the modeling of individual behaviors that affect supply including, for example, the uncertainty of age of retirement. A microsimulation approach relies on multiple iterations of probabilities that, when repeatedly run, produce not only an &quot;average&quot; estimate of future supply but also a range of &quot;certainty&quot; of the forecast around the average.
- _Out-of-State Supply and Re-entry:_ This is the number of LPNs and RNs that 1. annually enter the North Carolina workforce after completing their education outside of North Carolina; 2. move from inactive to active practice; 3. enter practice in NC after practicing in another state.
- _Projected future workforce:_ This is the forecast of the next year&#39;s RN and LPN workforce derived from the previous year&#39;s workforce after removing leavers and adding joiners. This process was repeated annually to generate forecasts from 2018 until 2030.
- _Full Time Equivalent (FTE) versus Headcount:_ FTE and Headcount are both ways of &quot;counting&quot; nurses. In headcount, each employee is counted as one regardless of whether they are full or part time. When using FTE, nurses&#39; hours are counted as a percentage of a predetermined &quot;full time.&quot; Our model defined full time as forty hours. For example a Nurse to reflect their specific needs, may only work as a nurse for 4 hours a day Monday to Thursday, a total of 16 hours and an FTE of 0.4.
- _Ratio of headcount (HC)/FTE:_ The number of hours nurses work is an important component of supply. We modeled FTE in the probabilistic model based on the mean and standard deviation of hours work as a function of age, gender, specialty and employment setting using NC BON licensure files which contain average hours worked per week in nursing.
- _Retirements and Attrition:_ One of the biggest drivers of changes in the supply of nurses is exit from practice. The model included attrition from the workforce due to retirement, death, moving to inactive status and leaving practice in NC. The probability of exiting the workforce was modeled using a logistic regression that examined the effect of the nurse&#39;s gender, age, employment setting and highest degree.
- _RN versus LPN_: To be a Registered Nurse, or RN, a two-year postsecondary degree (typically an Associate&#39;s Degree in Nursing, or ADN) is minimally required. Registered Nurses can also be trained in four year postsecondary programs (Bachelor of Science in Nursing, or BSN). RN scope of practice does not ot require supervision – their practice in independent and comprehensive. However RNs are most often administratively supervised in work settings by other RNs, by Advanced Practice Registered Nurses (RNs holding a master&#39;s degree in their specialty) or possibly by physicians. Licensed Practical Nurses, or LPNs, only require one year of postsecondary education and clinical training, and must be supervised in their scope of practice by RNs, APRNS, or physicians. LPN scope of practice is dependent and focused.

# About the Project

## Who is this model for, and how will or can it be used?

The NC Nursing Forecast Tool is intended for use by a wide variety of stakeholders interested in health care workforce policy and planning. Examples of the types of individuals and groups for whom the tool will be useful and examples of the ways estimates from the models can be used include:

- **Nursing-practice or human-resource managers** : Nursing practice managers and hospital and health-system executives can use the model for workforce planning for their practices, hospitals, or health systems.
- **Professional groups and private foundations:** The model provides information that state nursing societies, state and national specialty societies and associations, and other groups representing nurses and other clinicians can use to educate and engage leaders and the general public on healthcare workforce issues and policy interventions needed to address those issues.
- **Local and state policymakers** : Policymakers can use the model to inform local- and state-level workforce policies including decisions about whether to develop new clinical placement sites or invest in certain nursing program types to attract more nurses to underserved areas.
- **Federal health planners or policy makers** : The model will be useful to national stakeholders who need better and more timely information about nurse workforce supply, healthcare services use, and the capacity of nurse supply to meet demand for healthcare services. Estimates from this model can help guide investments in nursing education as well as healthcare payment policy, health care workforce shortage area designation criteria, and other national policy issues.
- **Nursing Education Leaders:** Schools of nursing can use this model to understand where their graduates are gaining employment and what settings have high demand for graduate nurses, as well as make decisions about clinical placement sites and investments in various types of nursing programs

## What are the different parts of this model?

The nursing workforce projection model includes four key elements

1. A supply model
2. A demand model
3. Estimations of future nursing workforce shortages/surpluses in North Carolina
4. A range of estimates of future shortages/surpluses under different assumptions about factors affecting the demand and supply of nurses in the state.

_ **The Supply Model** _

The supply model projects the future headcount and FTE of RNs and LPNs from 2018-2030. The basic principle of supply modeling is to take the current workforce, subtract leavers and add joiners for each year to generate a forecast for the next year. A detailed structure of the approach is summarized below:

**Figure 1: Supply Model for Estimating North Carolina RN and LPN workforce, 2018-2030**

![](RackMultipart20200914-4-1bqbfaq_html_339148e7eecb7a9c.png)

An agent-based microsimulation approach was used to develop the supply model. This approach involves applying many repeated computer simulations of trajectories of _individual_ nurses based on their age, nurse type (RN and LPN), degree (ADN, BSN, LPN), gender, and employment setting (hospital, ambulatory care, nursing home/extended care/assistive living, home health/hospice, public and community health, academic settings, mental health, and correctional facilities).

_ **The Demand Model** _

Demand was modeled at the county-level for each setting. Different approaches for calculating forecast demand were used as a result of the variation in data measuring existing demand. The demand forecast for public and community health, nursing education, and correctional facilities was solely dependent on population change (which means a 10% growth in population would generate a 10% growth in demand). For the remaining setting separate regression models were developed to predict demand based on model predictors (e.g. gender, age, race) specific to that setting.

The model forecasts demand at the Area Health Education Center (AHEC) region and Medicaid region levels. A crosswalk of counties to these larger units of geography is available.

The following table summarizes the model predictors of demand for these settings.

[INSERT CHART 1]

      - Forecasts of future demand were then generated using the population forecasts from the NC Office of Budget and Management to model the effect of changes in Age, Gender, Race population numbers. Non-population forecast data such as % insured remained unchanged for all years.
      - Demand for future demand of visits depending on setting were converted to FTE by using the ratio of visits to FTE in 2018 in all future years. For example, a 10% increase in demand for Ambulatory cases is modelled as a 10% increase in FTE demand for Ambulatory setting Nurses from the baseline of 2018.
      - Demand forecasts by Headcount were estimated by taking the average Headcount to FTE ratio for a given setting. Due to local variation in FTE as result of age and gender, demand Headcount forecasts should be considered a &quot;guide.&quot;

_ **Estimating Shortage/Surplus** _

For all demand settings, there are be multiple displays which compare supply to demand to estimate if there will be a shortage or surplus in this setting. In addition to a forecast at the all state level, there are forecasts at the AHEC, Medicaid, and Metro vs Non-Metro levels.

_ **Modeling Alternative Future Scenarios** _

The baseline model assumes that the factors affecting the supply and demand for nursing services will continue as they have in 2018. Yet we know that nursing workforce participation patterns, models of care and other factors are likely to change. To account for these deviations from the _status quo_, we modeled approximately six alternative future scenarios known to affect supply and demand:

## What data are used in the model?

The supply model draws on historical NC licensure data from 2008-2018, which contains annual licensure data for all RNs obtained from the NC Board of Nursing.These data are collected as a part of the biannual license renewal process and represent a complete census of NC nurses. These NC BON data are housed in the NC Health Professions Data System (HPDS) at the Sheps Center. HPDS data go back to 1979 and include demographic, education, practice and location variables needed in the supply model described below.

The demand model draws on different data sources to model aspects of demand that are relevant to a given setting as setout below:

[INSERT CHART 2]

## How were the settings for supply and demand modeling selected?

The final model included the following settings: hospital, ambulatory care, nursing home/extended care/assistive living, home health/hospice, public and community health, academic settings, mental health, and correctional facilities.

We originally proposed to include other settings, like inpatient versus outpatient hospital,emergency department, and mental health, based on NC population health needs and the shift of care from inpatient to outpatient settings. However, these settings were not collected after 2013 due to a change in the Nursys data system. We ultimately modeled settings based on Nursys setting definitions after 2014. Additionally, given that we could no longer identify mental health nurses from their employment setting, nurses working in a mental health setting were identified based on their specialty and/or employer.

## Are APRNs included in the model?

Advanced Practice Nurses— nurse practitioners (NPs), certified nurse midwives (CNMs), certified registered nurse anesthetist (CRNAs), or clinical nurse specialist (CNSs)—are not included in the workforce projection model because they are different workforce in terms of demand and supply. However, because APRNs are licensed as RNs in NC, we needed to develop a method to remove them from the analysis.

NPs and CNMs with an active practice agreement in North Carolina were identified as APRNs. CRNAs and CNSs self-report flag their roles in the licensure data. NPs, CNMs, and CRNAs in active practice in North Carolina were removed from the RN workforce data. However, CNSs remain in the RN workforce data because of the significant overlap between RN and CNS roles. NPs reporting an active RN practice location but not an active NP practice location remain in the RN workforce data. APRNs who are not currently practicing as an APRN also remained in the RN workforce population.

## What are confidence intervals? Why do you use them?

Confidence intervals are used to convey the uncertainty in the forecast and to provide an estimated range around a predicted value. As a comparison, it is generally accepted that the forecasting of the trajectory of a hurricane has a degree of uncertainty in that the longer range the forecast the less certain of the path of the hurricane. Workforce modelling has a similar degree of uncertainty generated by often by minor changes within a year that over time have a cumulative effect, for example if all nurses, in the coming years, were to retire 5 years earlier than was typical. The workforce supply over each forecast year dramatically diverge from the typical forecast. This is unlikely but the calculation of confidence intervals takes into consideration the cumulative effect of individual variation of not only retirements but in all aspect of the supply forecast.

![](RackMultipart20200914-4-1bqbfaq_html_34a0e6f5190f3042.png)

## How is this model different from other models?

There are a number of innovations used in this model:

- **Settings:** The model does not consider the Nurse workforce as a single entity, instead eight different settings are modeled. This enables the modeling of the effect for example the shift in care from Hospitals to Ambulatory and resultant shift in Nursing workforce to reflect this.
- **Return to Practice:** Many models consider the &quot;available workforce&quot; rather than the workforce that is clinically active. This typically results in supply forecast that overstate the actual supply. This model takes into consideration Nurse who are not actively practicing, for example to bring up their family, and models there return to practice.
- **Diffusion** : The model includes the real-life behavior of nurses moving either geographically or between settings as their career develops.
- **Visualization:** Need something on this, especially on analysis are various sub-state options

## What makes this model transparent?

The project team has tried to be as transparent as possible by describing the model&#39;s methods and assumptions and by providing detailed resources in the form of frequently asked questions below, and a set of additional resources on the model website. Although the code for generating supply, healthcare services use and relative capacity estimates is not available without permission, model users can download supply, use, and capacity estimates. Furthermore, users can view the code used to generate the model visualizations.

# What if I want to know more? (More advanced questions.)

## How does the web-based interface work?

The web-based interface is built using a variety of open source software, most notably the D3 data visualization library, the javascript framework Svelte and the javascript bundler Rollup. The nurse diffusion map also makes heavy use of the Mapbox GL JS javascript library. Most of the website style (i.e., CSS) is defined using Bulma, a CSS framework. Together, these compose the user interface.

The data is housed on a server provided by Carolina CloudApps within a container running Node.js. The main job of this server is to pass data from an SQLite database to the user interface. The database is loaded with precalculated projection data for all the parameter combinations in the visualizations.

## How do we model nursing supply?

The model estimates nurse supply by setting, county and year. Due to some counties having a very small population and therefore forecasts of limited value, results are then aggregated to the state, AHEC, Metropolitan and medicad regions. Users can view Nurse supply estimates in terms of numbers of Nurses (&quot;headcount&quot;) or patient care full-time equivalents (FTEs).

The model uses an agent-based approach to estimating future nurse supply. This means that all nurses involved in patient care —and their career decisions from training through retirement— are estimated individually in the model.

A nurse &quot;agent&quot; can enter the model in one of two ways. First, all nurse active in NC in 2018 are included in the model. Data on the demographic characteristics, setting, and geographic distribution of these nurses were developed based on NC Nurse Licensure dataset. These algorithms produced a baseline estimate of nurse supply in 2018 by age, sex, setting and county.

Second, a nurse can enter the supply model through the model&#39;s Education pipeline. We used data from the Licensure to estimate the demographic characteristics, location, setting of nurses entering the workforce.

In each year after a nurse &quot;enters&quot; the model, the model updates 1) the number of patient care FTEs that nurse will provide in the year, and 2) that nurses geographic location and setting.

In the supply model, a Nurse can work between 0 and 1.0 patient care FTEs, based on 1 FTE being a 40 hour week. The FTE assigned to an individual nurse is randomly allocated as a function of the average and standard deviation of nurse FTE&#39;s by Nurse type, age, gender and setting.

The model assumes certain limits to the supply based on agent characteristics. For example, the model also assumes that all nurses retire before reaching 70 years of age.

The model accounts not only for how much a nurse works but also where a nurse works. In each year in which a nurse is considered actively practicing in the model, the model calculates the probability that that individual nurse will move.

## How did we model demand of healthcare services?

Each setting has a different demand measure:

- Hospital, Ambulatory Care and Home Health are counted in visits
- Mental health is counted in cases
- Nursing Home is counted in residency days
- Public and Community Health, Nursing Education and Correctional Facility by general population

To enable a meaningful comparison across setting the model converts these different measures to an FTE for each setting, based on the assumption that the supply matches demand in the initial forecast year and that the demand measure per FTE remains constant for the forecast years.

Forecast demand for each setting is calculated using separate models as set out above.

## How does the model diffuse nurses to different geographies and settings?

Using licensure data between 2015 and 2018, a probability of nursing moving settings and geographic location was constructed. Using these probabilities, the model then &quot;tests&quot; each nurse for each year of the model forecast for a change in geography and setting.

## What are the display options for demand and what do they mean?

- **FTE** : Demand FTE Forecast
- **Headcount** : Demand Forecast headcount. Calculated by FTE demand forecast \* (Total All State Headcount/Total All State FTE)
- **FTE per Population** : Demand FTE Forecast per 10,000 population
- **Headcount per Population** : Demand Headcount Forecast per 10,000 population
- **Supply-Demand by FTE** : The absolute difference between supply and demand forecast. When this is negative, it means demand is greater than supply. Calculated by Supply FTE – Demand FTE.
- **Supply/Demand by FTE** : The ratio between supply and demand forecast. When this is \&lt;1, it means demand is greater than supply. Calculated by Supply FTE/Demand FTE.
- **Supply Demand by Pop by FTE** : The absolute difference between supply and demand forecast relative to population. Calculated by Supply FTE per 10,000 population – Demand FTE per 10,000 population.
- **Supply/Demand by Pop by FTE** : The relative difference between supply and demand forecast relative to population. Calculated by Supply FTE per 10,000 population / Demand FTE per 10,000 population.
- **Supply-Demand by Headcount:** The absolute difference between supply and demand forecast. When this is negative, it means demand is greater than supply. Calculated by Supply Headcount – Demand Headcount.
- **Supply/Demand by Headcount** : The ratio between supply and demand forecast. When this is \&lt;1, it means demand is greater than supply. Calculated by Supply Headcount/Demand Headcount.

## What is relative capacity, and how is it included in the model?

The model generates a forecast of surplus/shortage in terms of absolute and relative capacity. The absolute is the difference between forecast demand and supply. The relative capacity is the ratio between demand and supply. The relative capacity enables are more useful comparison between geographies or settings. For example, two geographies of different sizes may be both forecast to have a shortage of 10 and 100 FTE nurses respectively. The natural view would be that the second geography has a bigger shortage than the first. However, if the two geographies have a forecast of supply 10 and 1000 FTE respectively. Then the geographies have a relative capacity of 50% and 90% respectively, which means the first geographies has only half of the workforce it requires showing that it in relative terms has a greater workforce issue.

## Why does the model include scenarios?

The model projects nurse supply, health care service use, and relative capacity under multiple scenarios. The scenarios were chosen based on potential and likely changes that might occur to factors influencing the supply of nurses and the demand for health care services. Providing users with a variety of scenarios—as well as options for adjusting the scenarios—allows users to customize the model&#39;s output to suit their beliefs about what the future might look like and to develop interventions to address potential shortages and imbalances. For information on how to implement model scenarios in the web-based tool, please see the [Help](https://www2.shepscenter.unc.edu/workforce/help.php) page.
