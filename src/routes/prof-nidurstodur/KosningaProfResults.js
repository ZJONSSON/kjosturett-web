import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Collapse } from 'react-collapse';
import Img from 'react-image';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './styles.scss';
import Link from '../../Link';
import transparent from './transparent.png';
import { getAssetUrl, candidateImage } from '../../utils';

const scoreToFloatingPoint = (score, scalar = 1) =>
  Math.max(1, Math.ceil(score / scalar)) / 100;

class KosningaprofResults extends PureComponent {
  state = {
    open: {},
  };
  toggle(party) {
    this.setState(({ open }) => ({
      open: {
        ...open,
        [party]: !open[party],
      },
    }));
  }
  render() {
    const { questions, answers, results, candidates, parties } = this.props;
    const partyScoreScalar = parties.length ? parties[0].score / 100 : 1;
    return (
      <div className={s.root}>
        <p className={s.lead}>
          Niðurstöður úr kosningaprófi <strong>Kjóstu rétt</strong>. Ertu enn
          óviss um hvað skal kjósa? Lestu{' '}
          <Link href="/malefni/atvinnumal">stefnulýsingar flokkana</Link> í þeim
          málefnum sem þér þykja mikilvæg.
        </p>
        <p>
          <Link className={s.takeTest} href="/kosningaprof">
            Taka kosningaprófið!
          </Link>
        </p>

        <h3>Stjórnmálaflokkar</h3>
        <p className={s.nonLead}>
          Flokkunum er raðað eftir afstöðu þeirra í kosningaprófinu samanborið
          við þín svör. <strong>Smelltu á flokk</strong> til þess að skoða
          líkindi einstakra spurninga.
        </p>
        {parties.filter(party => party.score).map(party => (
          <div key={party.letter}>
            <div
              className={s.party}
              key={party.url}
              role="button"
              onClick={() => this.toggle(party.letter)}
            >
              <div
                className={s.partyProgress}
                style={{
                  transform: `scaleX(${scoreToFloatingPoint(
                    party.score,
                    partyScoreScalar,
                  )})`,
                }}
              />
              <img
                src={getAssetUrl('party-icons', party.url)}
                className={s.partyLogo}
              />
              <div className={s.partyName}>{party.name}</div>
              <div className={s.partyPercentage}>{Math.ceil(party.score)}%</div>
            </div>
            <Collapse
              isOpened={this.state.open[party.letter] === true}
              springConfig={{
                stiffness: 100,
                damping: 20,
              }}
            >
              {questions
                .map(question => ({
                  ...question,
                  myAnswer: question.myAnswer || 3,
                  partyAnswer: party.reply[question.id] || 3,
                }))
                .sort((a, b) => {
                  const aAgree = Math.abs(a.myAnswer - a.partyAnswer);
                  const bAgree = Math.abs(b.myAnswer - b.partyAnswer);
                  if (a.myAnswer === 3 || a.myAnswer === 6) {
                    return 1;
                  }
                  if (
                    b.myAnswer === 3 ||
                    b.myAnswer === 6 ||
                    (isNaN(aAgree) || isNaN(bAgree))
                  ) {
                    return -1;
                  }
                  return aAgree - bAgree;
                })
                .map(({ id, myAnswer, question, partyAnswer }) => {
                  const iAmIndiffrent = !(myAnswer !== 3 && myAnswer !== 6);
                  const pluralParty = party.name === 'Píratar';
                  const partyIndiffrent = !(
                    partyAnswer !== 3 && partyAnswer !== 6
                  );
                  const difference = Math.abs(myAnswer - partyAnswer);

                  return (
                    <div className={s.partyQuestion} key={id}>
                      <h4>
                        <i
                          className={cx(
                            s.dot,
                            !iAmIndiffrent && s[`dot${difference}`],
                          )}
                        />
                        {question}
                      </h4>

                      {difference === 0 ? (
                        <div>
                          Bæði ég og {party.name} erum{' '}
                          <strong>
                            {answers.textMap[myAnswer].toLowerCase()}
                          </strong>{' '}
                          {iAmIndiffrent && 'gagnvart '} þessari staðhæfingu.
                        </div>
                      ) : (
                        <div>
                          Ég er{' '}
                          <strong>
                            {(answers.textMap[myAnswer] || 'hlutlaus'
                            ).toLowerCase()}
                          </strong>{' '}
                          en {party.name} {pluralParty ? 'eru ' : 'er '}
                          <strong>
                            {(answers.textMap[partyAnswer] || 'hlutlaus'
                            ).toLowerCase()}
                            {(partyIndiffrent && pluralParty && 'ir ') || ' '}
                          </strong>{' '}
                          {partyIndiffrent && 'gagnvart '} þessari staðhæfingu.
                        </div>
                      )}
                    </div>
                  );
                })}
            </Collapse>
          </div>
        ))}
        <h3>Frambjóðendur</h3>
        <p className={s.nonLead}>
          {/* TODO: Filter by kjördæmi */}
          Frambjóðendur allra kjördæma.
        </p>
        <div className={s.candidates}>
          {candidates.slice(0, 12).map(candidate => {
            const party = parties.find(x => x.letter === candidate.party);
            return (
              <div
                key={candidate.slug}
                className={s.candidate}
                style={{
                  backgroundColor: party && party.color,
                }}
              >
                <Img
                  className={s.candidateImg}
                  src={[candidateImage(candidate.slug), transparent]}
                  color="https://via.placeholder.com/400x400?text=Mynd+vantar"
                />
                <div className={s.candidateProgressBar}>
                  <div
                    className={s.candidateProgress}
                    style={{
                      transform: `scaleX(${scoreToFloatingPoint(
                        candidate.score,
                      )})`,
                    }}
                  />
                </div>
                <div className={s.candidatePercentage}>
                  <span>{Math.ceil(candidate.score)}%</span>
                </div>
                <div className={s.candidateInfo}>
                  <div className={s.candidateName}>{candidate.name}</div>
                  {party && (
                    <div className={s.candidateParty}>
                      {party.name} (x{candidate.party})
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(KosningaprofResults);
