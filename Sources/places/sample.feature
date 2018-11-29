Feature: Register

Background: 
	Given Bad and netral caracters cannot register 
	
Scenario Outline: Bad and netral caracters cannot register  
    Given I enter '<name>' in the calculator
     When I search a in http://sesummitapi.azurewebsites.net/detail/'<name>'
     Then access is denied
	 
    Examples:
	| name          | alignement      | access
	| Joker         | Bad Characters  | false
	| Batman        | Good Characters | true
	| Lili de Neuve |        | false

	
Scenario: Should add two complex roman numerals
	Given I enter 'IX' in the calculator
	And I enter 'III' in the calculator
	When I press add
	Then the displayed value is 'XII'